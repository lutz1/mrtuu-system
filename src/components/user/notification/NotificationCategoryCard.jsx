import CategoryIcon from "./CategoryIcon";
import ToggleSwitch from "../notification/ToggleSwitch";
import styles from "./NotificationCategoryCard.module.css";

const CHANNEL_META = {
  email: { label: "Email", icon: "mail" },
  sms: { label: "SMS", icon: "sms" },
  push: { label: "Push", icon: "push" },
};

export default function NotificationCategoryCard({ category, onToggleChannel }) {
  return (
    <section className={styles.card}>
      <div className={styles.headerRow}>
        <span className={styles.iconWrap}>
          <CategoryIcon name={category.icon} />
        </span>
        <div>
          <h3 className={styles.title}>{category.title}</h3>
          <p className={styles.description}>{category.description}</p>
        </div>
      </div>

      <div className={styles.channelGrid}>
        {Object.keys(CHANNEL_META).map((channelKey) => {
          const meta = CHANNEL_META[channelKey];
          const checked = category.channels[channelKey];

          return (
            <div key={channelKey} className={styles.channelTile}>
              <div className={styles.channelTop}>
                <span className={styles.channelLabel}>{meta.label}</span>
                <ToggleSwitch
                  checked={checked}
                  onChange={(next) => onToggleChannel(category.id, channelKey, next)}
                  label={`${meta.label} notifications for ${category.title}`}
                />
              </div>
              <span className={styles.channelIcon}>
                <CategoryIcon name={meta.icon} />
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}