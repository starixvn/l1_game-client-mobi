import React, { useEffect, useState } from "react";

import { GameState } from "../game-container/type";
import styles from "./road-map-statistic.module.scss";

type Props = {
  col: number;
  row: number;
};

export default function Dot(props: Props) {
  const { col, row } = props;
  return (
    <div
      className={styles["dot"] + " " + styles["blink"]}
      style={{
        gridColumnStart: col.toString(),
        gridRowStart: row.toString(),
      }}
      id="dot-next"
    ></div>
  );
}
