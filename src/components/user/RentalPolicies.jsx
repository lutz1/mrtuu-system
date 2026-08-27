import { useState } from "react";
import { IconPlus, IconMinus } from "./icons";
import styles from "./RentalPolicies.module.css";

export default function RentalPolicies({ policies }) {
  const [openTitle, setOpenTitle] = useState(null);

  const toggle = (title) => setOpenTitle((prev) => (prev === title ? null : title));

  return (
    <div className={styles.policiesSection}>
      <h2 className={styles.sectionHeading}>Rental Policies</h2>
      <div className={styles.accordionList}>
        {policies.map((policy) => {
          const isOpen = openTitle === policy.title;
          return (
            <div className={styles.accordionItem} key={policy.title}>
              <button
                type="button"
                className={styles.accordionTrigger}
                onClick={() => toggle(policy.title)}
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