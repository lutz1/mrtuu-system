import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "../lib/firebase";

const VEHICLES_COLLECTION = "lykas_vehicles";
const REQUIRED_IMAGE_COUNT = 5;

const AdminVehiclesContext = createContext(null);

/* -------------------------------------------------------------------------- */
/*                              IMAGE HELPERS                                 */
/* -------------------------------------------------------------------------- */

async function uploadVehicleImage(vehicleId, file, slotIndex) {
  const storageRef = ref(
    storage,
    `vehicle-images/${vehicleId}/${slotIndex}-${file.name}`
  );
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

// Passes non-File entries (existing URL strings, or null for an empty
// slot) straight through unchanged — this is what makes it safe to reuse
// for both full 5-photo saves AND partial draft saves.
async function resolveImageUrls(vehicleId, images) {
  return Promise.all(
    images.map((entry, i) =>
      entry instanceof File
        ? uploadVehicleImage(vehicleId, entry, i)
        : Promise.resolve(entry)
    )
  );
}

async function tryDeleteImageUrl(url) {
  try {
    if (!url) return;
    await deleteObject(ref(storage, url));
  } catch (err) {
    console.warn(
      "Could not delete old vehicle image (may already be gone):",
      err
    );
  }
}

/* -------------------------------------------------------------------------- */
/*                            FIRESTORE HELPERS                               */
/* -------------------------------------------------------------------------- */

// Full publish path — always requires exactly 5 images, always creates a
// non-draft (draft: false) vehicle.
async function addVehicle(vehicleData, images) {
  if (
    !images ||
    images.length !== REQUIRED_IMAGE_COUNT ||
    images.filter(Boolean).length < REQUIRED_IMAGE_COUNT
  ) {
    throw new Error(`Exactly ${REQUIRED_IMAGE_COUNT} images are required.`);
  }

  const docRef = await addDoc(collection(db, VEHICLES_COLLECTION), {
    ...vehicleData,
    draft: false,
    archived: false,
    archivedAt: null,
    images: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  const imageUrls = await resolveImageUrls(docRef.id, images);
  await updateDoc(doc(db, VEHICLES_COLLECTION, docRef.id), {
    images: imageUrls,
  });

  return { id: docRef.id, ...vehicleData, images: imageUrls, draft: false };
}

// Draft path — no image-count requirement, images may be partial or
// entirely absent. Always creates draft: true.
async function saveDraftVehicle(vehicleData, images) {
  const docRef = await addDoc(collection(db, VEHICLES_COLLECTION), {
    ...vehicleData,
    draft: true,
    archived: false,
    archivedAt: null,
    images: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  const imageUrls = images ? await resolveImageUrls(docRef.id, images) : [];
  await updateDoc(doc(db, VEHICLES_COLLECTION, docRef.id), {
    images: imageUrls,
  });

  return { id: docRef.id, ...vehicleData, images: imageUrls, draft: true };
}

/* -------------------------------------------------------------------------- */
/*                                 PROVIDER                                   */
/* -------------------------------------------------------------------------- */

export function AdminVehiclesProvider({ children }) {
  const [allVehicles, setAllVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const q = query(
      collection(db, VEHICLES_COLLECTION),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setAllVehicles(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        console.error("Failed to subscribe to vehicles:", err);
        setError(err);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  // Handles both full-publish updates (requireFullImages: true, the
  // default — unchanged behavior for every existing caller) AND
  // draft-aware updates (requireFullImages: false, images may be
  // partial/absent). `draft` in options lets a caller explicitly flip the
  // draft flag (e.g. publishing a draft sets draft: false); omit it to
  // leave whatever the doc already has untouched.
  const updateVehicle = useCallback(
    async (id, vehicleData, images, options = {}) => {
      const { requireFullImages = true, draft } = options;
      const existing = allVehicles.find((v) => String(v.id) === String(id));
      const previousImages = existing?.images ?? [];

      let imageUrls = previousImages;
      if (images) {
        if (requireFullImages) {
          const filledCount = images.filter(Boolean).length;
          if (images.length !== REQUIRED_IMAGE_COUNT || filledCount < REQUIRED_IMAGE_COUNT) {
            throw new Error(
              `Exactly ${REQUIRED_IMAGE_COUNT} images are required.`
            );
          }
        }
        imageUrls = await resolveImageUrls(id, images);
        previousImages.forEach((oldUrl, i) => {
          if (oldUrl && oldUrl !== imageUrls[i]) tryDeleteImageUrl(oldUrl);
        });
      }

      const updatePayload = {
        ...vehicleData,
        images: imageUrls,
        updatedAt: serverTimestamp(),
      };
      if (typeof draft === "boolean") updatePayload.draft = draft;

      await updateDoc(doc(db, VEHICLES_COLLECTION, id), updatePayload);
    },
    [allVehicles]
  );

  const saveDraft = useCallback(async (vehicleData, images) => {
    return saveDraftVehicle(vehicleData, images);
  }, []);

  const deleteVehicleDraft = useCallback(
    async (id) => {
      const existing = allVehicles.find((v) => String(v.id) === String(id));
      if (existing?.images?.length) {
        await Promise.all(existing.images.filter(Boolean).map(tryDeleteImageUrl));
      }
      await deleteDoc(doc(db, VEHICLES_COLLECTION, id));
    },
    [allVehicles]
  );

  const archiveVehicle = useCallback(async (id) => {
    await updateDoc(doc(db, VEHICLES_COLLECTION, id), {
      archived: true,
      archivedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }, []);

  const restoreVehicle = useCallback(async (id) => {
    await updateDoc(doc(db, VEHICLES_COLLECTION, id), {
      archived: false,
      archivedAt: null,
      updatedAt: serverTimestamp(),
    });
  }, []);

  const getVehicleById = useCallback(
    (id) => allVehicles.find((v) => String(v.id) === String(id)),
    [allVehicles]
  );

  // Showroom-visible vehicles now exclude both archived AND draft entries.
  const vehicles = useMemo(
    () => allVehicles.filter((v) => !v.archived && !v.draft),
    [allVehicles]
  );

  const archivedVehicles = useMemo(
    () => allVehicles.filter((v) => v.archived),
    [allVehicles]
  );

  const draftVehicles = useMemo(
    () => allVehicles.filter((v) => v.draft),
    [allVehicles]
  );

  const value = useMemo(
    () => ({
      vehicles,
      archivedVehicles,
      draftVehicles,
      loading,
      error,
      addVehicle,
      saveDraft,
      updateVehicle,
      archiveVehicle,
      restoreVehicle,
      deleteVehicleDraft,
      getVehicleById,
    }),
    [
      vehicles,
      archivedVehicles,
      draftVehicles,
      loading,
      error,
      saveDraft,
      updateVehicle,
      archiveVehicle,
      restoreVehicle,
      deleteVehicleDraft,
      getVehicleById,
    ]
  );

  return (
    <AdminVehiclesContext.Provider value={value}>
      {children}
    </AdminVehiclesContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   HOOK                                     */
/* -------------------------------------------------------------------------- */

export function useAdminVehicles() {
  const context = useContext(AdminVehiclesContext);
  if (!context) {
    throw new Error(
      "useAdminVehicles must be used within an AdminVehiclesProvider"
    );
  }
  return context;
}