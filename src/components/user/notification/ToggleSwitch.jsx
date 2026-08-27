import styles from "./ToggleSwitch.module.css";

export default function ToggleSwitch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={`${styles.track} ${checked ? styles.on : ""}`}
      onClick={() => onChange?.(!checked)}
    >
      <span className={styles.thumb} />
    </button>
  );
}