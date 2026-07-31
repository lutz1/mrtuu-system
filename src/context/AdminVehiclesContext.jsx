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

// Module-scope — doesn't touch component state.
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

export function AdminVehiclesProvider({ children }) {
  const [vehicles, setVehicles] = useState([]);
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
        setVehicles(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
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

  // Depends on `vehicles`, so it stays inside the component — wrapped in
  // useCallback so it's still a stable reference when vehicles hasn't changed.
  const updateVehicle = useCallback(
    async (id, vehicleData, images) => {
      const existing = vehicles.find((v) => v.id === id);
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
    [vehicles]
  );

  const getVehicleById = useCallback(
    (id) => vehicles.find((v) => String(v.id) === String(id)),
    [vehicles]
  );

  const value = useMemo(
    () => ({
      vehicles,
      loading,
      error,
      addVehicle,
      updateVehicle,
      getVehicleById,
    }),
    [vehicles, loading, error, updateVehicle, getVehicleById]
  );

  return (
    <AdminVehiclesContext.Provider value={value}>
      {children}
    </AdminVehiclesContext.Provider>
  );
}

export function useAdminVehicles() {
  const context = useContext(AdminVehiclesContext);
  if (!context) {
    throw new Error(
      "useAdminVehicles must be used within an AdminVehiclesProvider"
    );
  }
  return context;
}
