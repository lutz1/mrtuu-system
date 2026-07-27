import React, { useMemo, useState } from "react";
import AdminLayout from "../dashboard/AdminLayout";
import CustomerStatCard from "../../../components/admin/customer/CustomerStatCard";
import CustomerFilterBar from "../../../components/admin/customer/CustomerFilterBar";
import CustomerTable from "../../../components/admin/customer/CustomerTable";
import Pagination from "../../../components/admin/common/Pagination";
import { MOCK_CUSTOMERS } from "../../../data/admin/mockCustomers";
import styles from "./AdminCustomersPage.module.css";

const PAGE_SIZE = 7;

function TotalIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3.5 19c1-3.6 3.2-5.3 5.5-5.3s4.5 1.7 5.5 5.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M14.5 15.5l1.2 1.2 2.3-2.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function NewIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3.5 19c1-3.6 3.2-5.3 5.5-5.3s4.5 1.7 5.5 5.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M17.5 8v6M14.5 11h6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function VerifiedIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3.5 19c1-3.6 3.2-5.3 5.5-5.3s4.5 1.7 5.5 5.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M14.5 12l2 2 3.5-3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function UnverifiedIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4.5 19c1-3.6 3.2-5.3 5.5-5.3.7 0 1.4.1 2 .4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState(MOCK_CUSTOMERS);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All Status");
  const [sort, setSort] = useState("All");
  const [page, setPage] = useState(1);

  const filteredCustomers = useMemo(() => {
    const q = query.trim().toLowerCase();
    let result = customers.filter((c) => {
      const matchesQuery = q === "" || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
      const matchesStatus = status === "All Status" || c.status === status;
      return matchesQuery && matchesStatus;
    });

    if (sort === "Name (A-Z)") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "Newest First") {
      result = [...result].slice().reverse();
    }
    // "Oldest First" and "All" keep the original dataset order.

    return result;
  }, [customers, query, status, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filteredCustomers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const makeFilterHandler = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  const handleToggleVerification = (id) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: c.status === "Verified" ? "Unverified" : "Verified" } : c))
    );
  };

  // TODO: wire to a real CSV/PDF export once available
  const handleExport = () => {
    console.log("Export customers:", filteredCustomers);
  };

  const verifiedCount = customers.filter((c) => c.status === "Verified").length;
  const unverifiedCount = customers.length - verifiedCount;

  return (
    <AdminLayout>
      <div className={styles.pageHeading}>
        <h1 className={styles.title}>Customers</h1>
      </div>

      <div className={styles.statsGrid}>
        <CustomerStatCard icon={<TotalIcon />} label="Total Customers" value={customers.length} />
        <CustomerStatCard icon={<NewIcon />} label="New This Month" value="18" />
        <CustomerStatCard icon={<VerifiedIcon />} label="Verified Customers" value={verifiedCount} />
        <CustomerStatCard icon={<UnverifiedIcon />} label="Unverified Customers" value={unverifiedCount} />
      </div>

      <div className={styles.filterWrap}>
        <CustomerFilterBar
          query={query}
          onQueryChange={makeFilterHandler(setQuery)}
          status={status}
          onStatusChange={makeFilterHandler(setStatus)}
          sort={sort}
          onSortChange={makeFilterHandler(setSort)}
          onExport={handleExport}
        />
      </div>

      <CustomerTable customers={pageItems} onToggleVerification={handleToggleVerification} />

      <Pagination
        page={currentPage}
        totalPages={totalPages}
        totalItems={filteredCustomers.length}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        itemLabel="customers"
      />
    </AdminLayout>
  );
}