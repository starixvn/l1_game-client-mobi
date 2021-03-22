import React from "react";
import styles from "../statistic.module.scss";

type Props = {
  col: number;
  row: number;
};

export default function ItemNext(props: Props) {
  const { col, row } = props;
  return (
    <div
      className={styles["item"] + " " + styles["blink"]}
      style={{
        gridColumnStart: col.toString(),
        gridRowStart: row.toString(),
      }}
    ></div>
  );
}
