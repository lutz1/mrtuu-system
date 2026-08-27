import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../dashboard/AdminLayout";
import DraftVehiclesTable from "../../../../components/admin/vehicle/drafts/DraftVehiclesTable";
import AddVehicleModal from "../../../../components/admin/vehicle/addVehicle/AddVehicleModal";
import Pagination from "../../../../components/admin/common/Pagination";
import { useAdminVehicles } from "../../../../context/AdminVehiclesContext";
import { useToast } from "../../../../context/ToastContext";
import styles from "./AdminVehicleDraftsPage.module.css";

const PAGE_SIZE = 6;

// Popular car brands for quick-select filter chips
const POPULAR_BRANDS = ["Toyota", "Ford", "Honda", "Nissan", "BMW", "Mercedes-Benz"];

export default function AdminVehicleDraftsPage() {
  const { draftVehicles, deleteVehicleDraft } = useAdminVehicles();
  const { showToast } = useToast();

  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("All Brands");
  const [sortBy, setSortBy] = useState("updated-desc"); // 'updated-desc' | 'updated-asc' | 'name'
  const [page, setPage] = useState(1);
  const [editingDraft, setEditingDraft] = useState(null);
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // Combine draft brands with standard popular brands
  const brandOptions = useMemo(() => {
    const existingBrands = draftVehicles.map((d) => d.brand).filter(Boolean);
    const combinedSet = new Set([...POPULAR_BRANDS, ...existingBrands]);
    return ["All Brands", ...Array.from(combinedSet).sort()];
  }, [draftVehicles]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = draftVehicles.filter((d) => {
      const matchesQuery =
        q === "" ||
        (d.name || "").toLowerCase().includes(q) ||
        (d.brand || "").toLowerCase().includes(q) ||
        (d.plate || "").toLowerCase().includes(q);
      const matchesBrand = brand === "All Brands" || d.brand === brand;
      return matchesQuery && matchesBrand;
    });

    list = [...list].sort((a, b) => {
      if (sortBy === "name") {
        return (a.name || "").localeCompare(b.name || "");
      }

      const aTime = a.updatedAt?.toDate ? a.updatedAt.toDate().getTime() : 0;
      const bTime = b.updatedAt?.toDate ? b.updatedAt.toDate().getTime() : 0;

      if (sortBy === "updated-asc") {
        return aTime - bTime; // Oldest to Newest update
      }
      return bTime - aTime; // Newest to Oldest update ('updated-desc')
    });

    return list;
  }, [draftVehicles, query, brand, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const makeFilterHandler = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  const handleResetFilters = () => {
    setQuery("");
    setBrand("All Brands");
    setSortBy("updated-desc");
    setPage(1);
  };

  const handleDelete = async (draft) => {
    // eslint-disable-next-line no-alert
    const confirmed = window.confirm(
      `Delete draft "${draft.name || "Untitled Draft"}"? This can't be undone.`
    );
    if (!confirmed) return;
    try {
      await deleteVehicleDraft(draft.id);
      showToast("Draft deleted.", { type: "info" });
    } catch (err) {
      console.error("Failed to delete draft:", err);
      showToast("Failed to delete this draft. Please try again.", { type: "error" });
    }
  };

  const isFiltered = brand !== "All Brands" || query !== "" || sortBy !== "updated-desc";

  return (
    <AdminLayout>
      <div className={styles.pageHeading}>
        <h1 className={styles.title}>Vehicle Drafts</h1>
        <p className={styles.breadcrumb}>
          <Link to="/admin/vehicles" className={styles.breadcrumbLink}>
            Vehicles
          </Link>
          <span className={styles.breadcrumbSep}>/</span>
          <span>Vehicle Drafts</span>
        </p>
      </div>

      <div className={styles.infoBanner}>
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
          <path d="M12 8v.01M12 11v5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <p>
          These vehicles are saved as drafts and are not visible in the showroom.
          <br />
          Only admin can add or edit vehicle drafts.
        </p>
      </div>

      <div className={styles.filterRow}>
        <div className={styles.searchWrap}>
          <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
            <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search draft vehicles (name, brand, plate no.)"
            value={query}
            onChange={(e) => makeFilterHandler(setQuery)(e.target.value)}
          />
        </div>

        {/* Brand selection dropdown */}
        <select
          className={styles.select}
          value={brand}
          onChange={(e) => makeFilterHandler(setBrand)(e.target.value)}
        >
          {brandOptions.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>

        {/* Sort order dropdown */}
        <select
          className={styles.select}
          value={sortBy}
          onChange={(e) => makeFilterHandler(setSortBy)(e.target.value)}
        >
          <option value="updated-desc">Newest to Oldest Update</option>
          <option value="updated-asc">Oldest to Newest Update</option>
          <option value="name">Name (A-Z)</option>
        </select>

        {/* Filter Panel Toggle Button */}
        <button
          type="button"
          className={`${styles.filterBtn} ${showFilterPanel ? styles.activeFilterBtn : ""}`}
          onClick={() => setShowFilterPanel((prev) => !prev)}
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6h16M7 12h10M10 18h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          Filter {isFiltered && "•"}
        </button>
      </div>

      {/* Advanced Filter Panel */}
      {showFilterPanel && (
        <div className={styles.filterPanel}>
          <div className={styles.filterPanelHeader}>
            <h3>Filter Options</h3>
            {isFiltered && (
              <button type="button" className={styles.resetBtn} onClick={handleResetFilters}>
                Reset Filters
              </button>
            )}
          </div>

          <div className={styles.filterPanelGrid}>
            <div>
              <label className={styles.filterLabel}>Brand</label>
              <div className={styles.chipGroup}>
                <button
                  type="button"
                  className={`${styles.chip} ${brand === "All Brands" ? styles.activeChip : ""}`}
                  onClick={() => makeFilterHandler(setBrand)("All Brands")}
                >
                  All Brands
                </button>
                {POPULAR_BRANDS.map((b) => (
                  <button
                    key={b}
                    type="button"
                    className={`${styles.chip} ${brand === b ? styles.activeChip : ""}`}
                    onClick={() => makeFilterHandler(setBrand)(b)}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={styles.filterLabel}>Last Updated</label>
              <div className={styles.chipGroup}>
                <button
                  type="button"
                  className={`${styles.chip} ${sortBy === "updated-desc" ? styles.activeChip : ""}`}
                  onClick={() => makeFilterHandler(setSortBy)("updated-desc")}
                >
                  Newest First
                </button>
                <button
                  type="button"
                  className={`${styles.chip} ${sortBy === "updated-asc" ? styles.activeChip : ""}`}
                  onClick={() => makeFilterHandler(setSortBy)("updated-asc")}
                >
                  Oldest First
                </button>
                <button
                  type="button"
                  className={`${styles.chip} ${sortBy === "name" ? styles.activeChip : ""}`}
                  onClick={() => makeFilterHandler(setSortBy)("name")}
                >
                  Name (A-Z)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <DraftVehiclesTable drafts={pageItems} onEdit={setEditingDraft} onDelete={handleDelete} />

      <Pagination
        page={currentPage}
        totalPages={totalPages}
        totalItems={filtered.length}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        itemLabel="drafts"
      />

      {editingDraft && <AddVehicleModal vehicle={editingDraft} onClose={() => setEditingDraft(null)} />}
    </AdminLayout>
  );
}