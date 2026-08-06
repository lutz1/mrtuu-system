import React from "react";
import styles from "./RadioOptionGroup.module.css";

export default function RadioOptionGroup({ name, options, value, onChange, layout = "vertical" }) {
  return (
    <div className={layout === "horizontal" ? styles.horizontal : styles.vertical}>
      {options.map((option) => (
        <label key={option} className={styles.option}>
          <input
            type="radio"
            name={name}
            value={option}
            checked={value === option}
            onChange={() => onChange(option)}
            className={styles.radioInput}
          />
          <span className={styles.radioCircle} />
          {option}
        </label>
      ))}
    </div>
  );
}