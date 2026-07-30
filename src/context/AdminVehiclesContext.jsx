import { createContext, useContext, useEffect, useState } from "react";
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

// Firestore collection per LYKAS_AJEX_SYSTEM_ARCHITECTURE.md — lykas_-prefixed,
// Lyka's-only. Firestore security rules are intentionally open for now per
// the current placeholder-auth state of the app (see admin-auth-design.md);
// revisit once StaffContext + permission-gated writes exist.
const VEHICLES_COLLECTION = "lykas_vehicles";
const REQUIRED_IMAGE_COUNT = 5;

const AdminVehiclesContext = createContext(null);

// Uploads a File to Storage under vehicle-images/{vehicleId}/{slotIndex}-{filename}
// and returns its public download URL.
async function uploadVehicleImage(vehicleId, file, slotIndex) {
  const storageRef = ref(
    storage,
    `vehicle-images/${vehicleId}/${slotIndex}-${file.name}`
  );
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

// images: array of length 5, each entry either a File (new upload) or a
// string (existing URL to keep as-is). Returns array of 5 URLs.
async function resolveImageUrls(vehicleId, images) {
  const urls = await Promise.all(
    images.map((entry, i) =>
      entry instanceof File
        ? uploadVehicleImage(vehicleId, entry, i)
        : Promise.resolve(entry)
    )
  );
  return urls;
}

// Best-effort cleanup — failures here shouldn't block the UI flow.
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

  // vehicleData: { name, brand, model, transmission, carType, seats, fuelType,
  //   mileage, price, plate, status, description, features: string[] }
  // images: array of exactly 5 Files
  const addVehicle = async (vehicleData, images) => {
    if (
      !images ||
      images.length !== REQUIRED_IMAGE_COUNT ||
      images.some((f) => !f)
    ) {
      throw new Error(`Exactly ${REQUIRED_IMAGE_COUNT} images are required.`);
    }

    // Create the doc first (with empty images) so we have an ID to namespace
    // the Storage upload path under, then backfill the real image URLs.
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
  };

  // images: array of length 5, each a File (new) or existing URL string (unchanged)
  const updateVehicle = async (id, vehicleData, images) => {
    const existing = vehicles.find((v) => v.id === id);
    const previousImages = existing?.images ?? [];

    let imageUrls = previousImages;
    if (images) {
      if (images.length !== REQUIRED_IMAGE_COUNT || images.some((f) => !f)) {
        throw new Error(`Exactly ${REQUIRED_IMAGE_COUNT} images are required.`);
      }
      imageUrls = await resolveImageUrls(id, images);

      // Clean up any slot whose URL actually changed.
      previousImages.forEach((oldUrl, i) => {
        if (oldUrl && oldUrl !== imageUrls[i]) tryDeleteImageUrl(oldUrl);
      });
    }

    await updateDoc(doc(db, VEHICLES_COLLECTION, id), {
      ...vehicleData,
      images: imageUrls,
      updatedAt: serverTimestamp(),
    });
  };

  const getVehicleById = (id) =>
    vehicles.find((v) => String(v.id) === String(id));

  const value = {
    vehicles,
    loading,
    error,
    addVehicle,
    updateVehicle,
    getVehicleById,
  };

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
