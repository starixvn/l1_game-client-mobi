import React, { useEffect, useState } from "react";

import { GameState } from "../game-container/type";
import styles from "./road-map-statistic.module.scss";

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
