import React from "react";
import styles from "./mini-statistic.module.scss";
type Props = {
  results: Array<string>;
};
export default function MiniStatistic(props: Props) {
  const { results } = props;

  return <div className={styles["container"]}></div>;
}
