import React from "react";
import { Link } from "react-router-dom";
import styles from "./Breadcrumb.module.css";

export default function Breadcrumb({ items }) {
  return (
    <div className={styles.breadcrumb}>
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <React.Fragment key={item.to || item.label}>
            {isLast ? (
              <span className={styles.breadcrumbCurrent}>{item.label}</span>
            ) : (
              <>
                <Link to={item.to} className={styles.breadcrumbLink}>
                  {item.label}
                </Link>
                <span className={styles.breadcrumbSeparator}>/</span>
              </>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}