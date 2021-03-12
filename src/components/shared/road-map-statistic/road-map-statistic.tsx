import React from "react";
import styles from "./road-map-statistic.module.scss";

type Props = {
  results: Array<string>;
  isWaitingResult: boolean;
};

const WaitingResultValue = "waiting-node";

function renderResultRatio(results: Array<string>) {
  const summaryNode: Array<JSX.Element> = [];

  const betChoiceRatio = results.reduce((summary, value) => {
    summary[value] = (summary[value] || 0) + 1;

    return summary;
  }, {});

  Object.keys(betChoiceRatio).forEach((betChoice, index) => {
    summaryNode.push(
      <div key={`ratio-statistic-${index}`}>
        {betChoice} :{" "}
        {Math.ceil((betChoiceRatio[betChoice] / results.length) * 100)}
      </div>
    );
  });

  return <div className={styles["ratio-summary"]}>{summaryNode}</div>;
}

function renderRoadMap(results: Array<string>, isWaitingResult: boolean) {
  const ui: Array<JSX.Element> = [];

  let prevResult = results[0];
  let rowItems: Array<JSX.Element> = [];
  let rowIndex: number = 0;

  isWaitingResult && results.push(WaitingResultValue);

  results.forEach((result, index) => {
    const resultNode = renderResultNode(
      result,
      isWaitingResult,
      `item-${index}`
    );

    if (
      (result === prevResult || result === WaitingResultValue) &&
      rowItems.length < 5
    ) {
      rowItems.push(resultNode);
    } else {
      ui.push(
        <div key={`row-${rowIndex++}`} className={styles["result-chain"]}>
          {rowItems.slice(0, rowItems.length)}
        </div>
      );

      rowItems = [resultNode];
    }

    prevResult = result;
  });

  ui.push(
    <div key={`row-${rowIndex++}`} className={styles["result-chain"]}>
      {rowItems}
    </div>
  );

  return ui;
}

function renderResultNode(
  result: string,
  isWaitingResult: boolean,
  key: string
) {
  return (
    <div
      key={key}
      className={`
      ${styles["road-map-node"]} 
      ${styles[result]}
      ${
        result === WaitingResultValue && isWaitingResult
          ? styles["waiting-result"]
          : ""
      }`}
    ></div>
  );
}

export default function RoadMapStatistic(props: Props) {
  return (
    <div className={styles["container"]}>
      <div className={styles["statistic-header"]}>
        <div className={styles["statistic-tab"]}>Odd/Even</div>
        <div className={styles["statistic-tab"]}>Dice 1st</div>
        <div className={styles["statistic-tab"]}>Dice 2st</div>
        <div className={styles["statistic-tab"]}>Dice 3st</div>
        <div className={styles["statistic-tab"]}>Dice 4st</div>
      </div>
      <div className={styles["statistic-board"]}>
        <div>{renderResultRatio(props.results)}</div>
        <div className={styles["road-map"]}>
          {renderRoadMap(props.results, props.isWaitingResult)}
        </div>
      </div>
    </div>
  );
}
