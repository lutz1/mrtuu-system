import React, { useMemo, useState } from "react";
import AdminLayout from "../dashboard/AdminLayout";
import ChecklistFilterTabs from "../../../components/admin/checklist/ChecklistFilterTabs";
import ChecklistSearchBar from "../../../components/admin/checklist/ChecklistSearchBar";
import ChecklistTable from "../../../components/admin/checklist/ChecklistTable";
import ChecklistDetailPanel from "../../../components/admin/checklist/ChecklistDetailPanel";
import Pagination from "../../../components/admin/common/Pagination";
import { ALL_CHECKLIST_ENTRIES } from "../../../data/admin/mockChecklist";
import styles from "./AdminChecklistPage.module.css";

const TAB_TITLES = {
  "Pending Documents": "Pending Document Check",
  "For Dispatcher": "Sent to Dispatcher",
  "Cleared / Completed": "Cleared / Completed Bookings",
  Rejected: "Rejected Bookings",
};

const PAGE_SIZE = 6;

export default function AdminChecklistPage() {
  // TODO: local-only state backed by mock data — swap for real Firestore
  // reads/writes once the admin data layer exists. Actions below (reject,
  // send to dispatcher) only mutate this in-memory array for now.
  const [entries, setEntries] = useState(ALL_CHECKLIST_ENTRIES);
  const [activeTab, setActiveTab] = useState("Pending Documents");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
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

  const totalPages = Math.max(1, Math.ceil(filteredEntries.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filteredEntries.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const selectedEntry = entries.find((entry) => entry.id === selectedId) ?? null;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setQuery("");
    setPage(1);
  };

  const handleQueryChange = (value) => {
    setQuery(value);
    setPage(1);
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
        <ChecklistSearchBar value={query} onChange={handleQueryChange} />
      </div>

      <ChecklistTable
        title={TAB_TITLES[activeTab]}
        totalCount={filteredEntries.length}
        entries={pageItems}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />

      <Pagination
        page={currentPage}
        totalPages={totalPages}
        totalItems={filteredEntries.length}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        itemLabel="entries"
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