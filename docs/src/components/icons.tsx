import styles from "./icons.module.css";
import { iconMapper } from "./utils";

export function Icons() {
  return (
    <div className={styles.icons}>
      {Object.values(iconMapper).map((item) => {
        return (
          <div key={item.label} className={styles.icon}>
            <div>{item.icon}</div>
            <div>{item.label}</div>
          </div>
        );
      })}
    </div>
  );
}
