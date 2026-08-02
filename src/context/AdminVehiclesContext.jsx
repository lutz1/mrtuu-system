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

async function addVehicle(vehicleData, images) {
  if (
    !images ||
    images.length !== REQUIRED_IMAGE_COUNT ||
    images.some((f) => !f)
  ) {
    throw new Error(`Exactly ${REQUIRED_IMAGE_COUNT} images are required.`);
  }

  const docRef = await addDoc(collection(db, VEHICLES_COLLECTION), {
    ...vehicleData,
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

  return { id: docRef.id, ...vehicleData, images: imageUrls };
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

  const updateVehicle = useCallback(
    async (id, vehicleData, images) => {
      const existing = allVehicles.find((v) => String(v.id) === String(id));
      const previousImages = existing?.images ?? [];

      let imageUrls = previousImages;
      if (images) {
        if (images.length !== REQUIRED_IMAGE_COUNT || images.some((f) => !f)) {
          throw new Error(
            `Exactly ${REQUIRED_IMAGE_COUNT} images are required.`
          );
        }
        imageUrls = await resolveImageUrls(id, images);
        previousImages.forEach((oldUrl, i) => {
          if (oldUrl && oldUrl !== imageUrls[i]) tryDeleteImageUrl(oldUrl);
        });
      }

      await updateDoc(doc(db, VEHICLES_COLLECTION, id), {
        ...vehicleData,
        images: imageUrls,
        updatedAt: serverTimestamp(),
      });
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

  // Derived arrays based on the real-time collection
  const vehicles = useMemo(
    () => allVehicles.filter((v) => !v.archived),
    [allVehicles]
  );
  
  const archivedVehicles = useMemo(
    () => allVehicles.filter((v) => v.archived),
    [allVehicles]
  );

  const value = useMemo(
    () => ({
      vehicles,
      archivedVehicles,
      loading,
      error,
      addVehicle,
      updateVehicle,
      archiveVehicle,
      restoreVehicle,
      getVehicleById,
    }),
    [
      vehicles,
      archivedVehicles,
      loading,
      error,
      updateVehicle,
      archiveVehicle,
      restoreVehicle,
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