import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../lib/firebase";

function toDate(value) {
  if (!value) return null;
  if (typeof value?.toDate === "function") return value.toDate();
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function formatGeneratedAt(value) {
  const d = toDate(value);
  if (!d) return "—";
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function useRecentReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "lykas_reports"),
      orderBy("generatedAt", "desc"),
      limit(5)
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setReports(
          snapshot.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              name: data.name,
              downloadUrl: data.downloadUrl,
              generatedAt: formatGeneratedAt(data.generatedAt),
            };
          })
        );
        setLoading(false);
      },
      (err) => {
        console.error("Failed to load recent reports:", err);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  return { reports, loading };
}
