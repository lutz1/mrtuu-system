import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import styles from "./BookingStatusDonut.module.css";

export default function BookingStatusDonut({ data, total }) {
  return (
    <section className={styles.card}>
      <h2 className={styles.title}>Booking by Status</h2>

      <div className={styles.chartRow}>
        <div className={styles.donutWrap}>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="label"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={2}
                stroke="none"
              >
                {data.map((entry) => (
                  <Cell key={entry.label} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <span className={styles.centerLabel}>{total}</span>
        </div>

        <ul className={styles.legend}>
          {data.map((entry) => {
            const percent = ((entry.count / total) * 100).toFixed(1);
            return (
              <li key={entry.label} className={styles.legendItem}>
                <span className={styles.legendDot} style={{ background: entry.color }} />
                <span className={styles.legendLabel}>{entry.label}</span>
                <span className={styles.legendValue}>
                  {entry.count} ({percent}%)
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}