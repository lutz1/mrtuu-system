import React, { useState } from "react";
import { IconPlus, IconMinus } from "./icons";
import styles from "./RentalPolicies.module.css";

export default function RentalPolicies({ policies }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => setOpenIndex((prev) => (prev === i ? null : i));

  return (
    <div className={styles.policiesSection}>
      <h2 className={styles.sectionHeading}>Rental Policies</h2>
      <div className={styles.accordionList}>
        {policies.map((policy, i) => {
          const isOpen = openIndex === i;
          return (
            <div className={styles.accordionItem} key={i}>
              <button
                type="button"
                className={styles.accordionTrigger}
                onClick={() => toggle(i)}
                aria-expanded={isOpen}
              >
                <span>{policy.title}</span>
                {isOpen ? <IconMinus className={styles.accordionIcon} /> : <IconPlus className={styles.accordionIcon} />}
              </button>
              {isOpen && <p className={styles.accordionContent}>{policy.content}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}