import React, { useMemo, useState } from "react";
import AdminLayout from "../dashboard/AdminLayout";
import ChecklistFilterTabs from "../../../components/admin/checklist/ChecklistFilterTabs";
import ChecklistSearchBar from "../../../components/admin/checklist/ChecklistSearchBar";
import ChecklistTable from "../../../components/admin/checklist/ChecklistTable";
import ChecklistDetailPanel from "../../../components/admin/checklist/ChecklistDetailPanel";
import { INITIAL_CHECKLIST_ENTRIES } from "../../../data/admin/mockChecklist";
import styles from "./AdminChecklistPage.module.css";

const TAB_TITLES = {
  "Pending Documents": "Pending Document Check",
  "For Dispatcher": "Sent to Dispatcher",
  "Cleared / Completed": "Cleared / Completed Bookings",
  Rejected: "Rejected Bookings",
};

export default function AdminChecklistPage() {
  // TODO: local-only state backed by mock data — swap for real Firestore
  // reads/writes once the admin data layer exists. Actions below (reject,
  // send to dispatcher) only mutate this in-memory array for now.
  const [entries, setEntries] = useState(INITIAL_CHECKLIST_ENTRIES);
  const [activeTab, setActiveTab] = useState("Pending Documents");
  const [query, setQuery] = useState("");
  // No entry selected on load — the popup only appears once the admin
  // explicitly clicks a row's eye icon.
  const [selectedId, setSelectedId] = useState(null);

  const filteredEntries = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries.filter((entry) => {
      const matchesTab = entry.checklistStatus === activeTab;
      const matchesQuery =
        q === "" ||
        entry.id.toLowerCase().includes(q) ||
        entry.customer.toLowerCase().includes(q) ||
        entry.vehicle.toLowerCase().includes(q);
      return matchesTab && matchesQuery;
    });
  }, [entries, activeTab, query]);

  const selectedEntry = entries.find((entry) => entry.id === selectedId) ?? null;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setQuery("");
  };

  const updateEntryStatus = (id, newStatus, remarks) => {
    setEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, checklistStatus: newStatus, remarks } : entry))
    );
  };

  const handleReject = (id, remarks) => {
    updateEntryStatus(id, "Rejected", remarks);
    setSelectedId(null);
  };

  const handleSendToDispatcher = (id, remarks) => {
    updateEntryStatus(id, "For Dispatcher", remarks);
    setSelectedId(null);
  };

  return (
    <AdminLayout>
      <div className={styles.pageHeading}>
        <h1 className={styles.title}>Checklist</h1>
      </div>

      <div className={styles.toolbar}>
        <ChecklistFilterTabs active={activeTab} onChange={handleTabChange} />
        <ChecklistSearchBar value={query} onChange={setQuery} />
      </div>

      <ChecklistTable
        title={TAB_TITLES[activeTab]}
        entries={filteredEntries}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />

      {selectedEntry && (
        <ChecklistDetailPanel
          entry={selectedEntry}
          onClose={() => setSelectedId(null)}
          onReject={handleReject}
          onSendToDispatcher={handleSendToDispatcher}
        />
      )}
    </AdminLayout>
  );
}