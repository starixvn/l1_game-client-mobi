import React from "react";

import {
  SettlementResult,
  Result,
  RoundHistory,
} from "../../games/se-die/sedie";
import { GameState } from "../game-container/type";
import styles from "./road-map-statistic.module.scss";
import Dot from "./dot";
import DotNext from "./dot-next";

type Props = {
  results: RoundHistory[];
  gameState: number;
};

type DiceColorType = {
  class: string;
  count: number;
};

type ResultDice = {
  odd: number;
  even: number;
};

type DataType = {
  type: DiceColorType;
  value: number;
  roundId: number;
};

type StatisticType = {
  data: Array<DataType>;
  statistic: ResultDice;
  resultDiceRed: Array<number>;
};

const typeDice = ["red1", "red2", "red3", "red4"];
const rowTotal = 7;

function handleColorDice(data: Result): DiceColorType {
  const result: DiceColorType = {
    class: "dot-red",
    count: 0,
  };
  let countType = 0;
  typeDice.forEach((type) => {
    if (data[type]) {
      countType++;
    }
  });
  result.count = countType;

  if (countType % 2) {
    result.class = "dot-red";
  } else {
    result.class = "dot-white";
  }

  return result;
}

function convertData(
  result: StatisticType,
  settlementResult: SettlementResult,
  resultDices: Result,
  roundId: number
) {
  const tmpData = {
    type: {
      class: "",
      count: 0,
    },
    value: 0,
    roundId: 0,
  };
  if (settlementResult.even) {
    result.statistic.even++;
    tmpData.value = 0;
  }

  if (settlementResult.odd) {
    result.statistic.odd++;
    tmpData.value = 1;
  }

  tmpData.type = handleColorDice(resultDices);
  tmpData.roundId = roundId;

  typeDice.forEach((name, index) => {
    if (resultDices[name]) {
      result.resultDiceRed[index]++;
    }
  });

  result.data.push(tmpData);

  return result;
}

function handleData(data: RoundHistory[]): StatisticType {
  let result: StatisticType = {
    data: [],
    statistic: { odd: 0, even: 0 },
    resultDiceRed: [0, 0, 0, 0],
  };
  data.forEach((value) => {
    const resultDices = value.result;
    const settlementResult = value.settlementResult;
    result = convertData(result, settlementResult, resultDices, value.roundId);
  });
  return result;
}

export function drawStatistic(
  statistic: StatisticType,
  isDotNext: boolean
): any {
  let col = 1,
    row = 1;
  let nextCol = 1;
  let previousResult = undefined;
  const rowMax = {};
  let colMax = 0;
  const data = [...statistic.data].reverse();

  let resultHandle: any = data.map((result) => {
    if (result.value === previousResult) {
      const max = rowMax.hasOwnProperty(col) ? rowMax[col] : rowTotal;

      if (row < max - 1) {
        row++;
      } else if (row === 0 && max === 1) {
        col = nextCol;
        nextCol++;
      } else {
        col++;
        rowMax[col] = row;
      }
    } else {
      row = 1;
      col = nextCol;
      nextCol++;
    }

    if (col > colMax) {
      colMax = col;
    }
    previousResult = result.value;

    return <Dot key={result.roundId} result={result} col={col} row={row}></Dot>;
  });

  if (isDotNext) {
    resultHandle.push(addNextMark(rowMax, row, col, nextCol));
  }

  return resultHandle;
}

function addNextMark(rowMax, row, col, nextCol) {
  const max = rowMax.hasOwnProperty(col) ? rowMax[col] : rowTotal;
  if (row < max - 1) {
    row++;
  } else {
    row = 0;
    col = nextCol;
  }

  if (row === 1 && col === 0) {
    col = 1;
    row = 0;
  }

  return <DotNext col={col} row={row}></DotNext>;
}

export default function RoadMapStatistic(props: Props) {
  const { results, gameState } = props;
  console.log(gameState);
  const data: StatisticType = handleData(results);
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  const totalDiceRed = data.resultDiceRed.reduce(reducer);

  return (
    <div className={styles["container"]}>
      <div className={styles["statistic-header"]}>
        <div>
          <span className={styles["titleOdd"]}> Odd</span>
          <span className={styles["number"]}>{data.statistic.odd}%</span>
        </div>
        <div>
          <span className={styles["titleEven"]}> Even</span>
          <span className={styles["number"]}>{data.statistic.even}%</span>
        </div>
        <div>
          <span className={styles["title"]}> Red 1</span>
          <span className={styles["number"]}>
            {Math.round((data.resultDiceRed[0] / totalDiceRed) * 100)}%
          </span>
        </div>
        <div>
          <span className={styles["title"]}> Red 2</span>
          <span className={styles["number"]}>
            {Math.round((data.resultDiceRed[1] / totalDiceRed) * 100)}%
          </span>
        </div>
        <div>
          <span className={styles["title"]}> Red 3</span>
          <span className={styles["number"]}>
            {Math.round((data.resultDiceRed[2] / totalDiceRed) * 100)}%
          </span>
        </div>
        <div>
          <span className={styles["title"]}> Red 4</span>
          <span className={styles["number"]}>
            {Math.round((data.resultDiceRed[3] / totalDiceRed) * 100)}%
          </span>
        </div>
      </div>
      <div className={styles["statistic-board"]}>
        <div className={styles["statistic-container"]}>
          <div className={styles["scoreboard-container"]}>
            {gameState === GameState.LockingBet
              ? drawStatistic(data, true)
              : drawStatistic(data, false)}
          </div>
        </div>
      </div>
    </div>
  );
}
