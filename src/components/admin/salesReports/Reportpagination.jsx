import React from "react";
import styles from "./ReportPagination.module.css";

export default function ReportPagination({
  page,
  pageSize,
  totalItems,
  onPageChange,
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  const goTo = (p) => {
    if (p < 1 || p > totalPages || p === page) return;
    onPageChange(p);
  };

  return (
    <div className={styles.footer}>
      <p className={styles.entries}>
        Showing {start} to {end} of {totalItems} entries
      </p>
      <div className={styles.pager}>
        <button
          type="button"
          className={styles.pageBtn}
          onClick={() => goTo(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
        >
          &lt;
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            type="button"
            className={`${styles.pageBtn} ${p === page ? styles.pageBtnActive : ""}`}
            onClick={() => goTo(p)}
          >
            {p}
          </button>
        ))}
        <button
          type="button"
          className={styles.pageBtn}
          onClick={() => goTo(page + 1)}
          disabled={page === totalPages}
          aria-label="Next page"
        >
          &gt;
        </button>
      </div>
    </div>
  );
}