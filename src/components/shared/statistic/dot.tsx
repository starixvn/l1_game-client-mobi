import React from "react";
import styles from "./statistic.module.scss";

type Props = {
  result: any;
  col: number;
  row: number;
};

export default function Dot(props: Props) {
  const { result, col, row } = props;
  return (
    <div
      className={styles[result.type.class]}
      style={{
        gridColumnStart: col.toString(),
        gridRowStart: row.toString(),
      }}
    >
      {result.type.count}
    </div>
  );
}
