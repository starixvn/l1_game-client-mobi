import React from "react";
import styles from "./road-map-statistic.module.scss";

export default function RoadMapStatistic() {
  return (
    <div className={styles["container"]}>
      <div className={styles["statistic-header"]}>Statistic </div>
      <div className={styles["statistic-board"]}>
        <div className={styles["result-chain"]}>
          <div className={styles["result-item"]}>1</div>
          <div className={styles["result-item"]}>1</div>
          <div className={styles["result-item"]}>1</div>
          <div className={styles["result-item"]}>1</div>
          <div className={styles["result-item"]}>1</div>
          <div className={styles["result-item"]}>1</div>
        </div>
        <div className={styles["result-chain"]}>
          <div className={styles["result-item"]}>1</div>
          <div className={styles["result-item"]}>1</div>
          <div className={styles["result-item"]}>1</div>
          <div className={styles["result-item"]}>1</div>
          <div className={styles["result-item"]}>1</div>
          <div className={styles["result-item"]}>1</div>
          <div className={styles["result-item"]}>1</div>
          <div className={styles["result-item"]}>1</div>
        </div>
      </div>
    </div>
  );
}
