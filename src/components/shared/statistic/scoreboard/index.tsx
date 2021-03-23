import React, { useRef } from "react";

import { SettlementResult, Result, RoundHistory } from "../../../games/se-die/sedie";
import styles from "../statistic.module.scss";
import Item from "./item";
import ItemNext from "./item-next";
import { StatisticType, DiceColor } from "../type";
import { GameState } from "../../game-base/type";

type Props = {
    results: RoundHistory[];
    gameState: number;
    typeDiceResult: string[];
};

const typeDice = ["red1", "red2", "red3", "red4"];
const rowTotal = 7;

const handleColorDice = (data: Result): DiceColor => {
    const result: DiceColor = {
        class: "item-red",
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
        result.class = "item-red";
    } else {
        result.class = "item-white";
    }

    return result;
};

const convertData = (result: StatisticType, settlementResult: SettlementResult, resultDices: Result, roundId: number) => {
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
};

const handleData = (data: RoundHistory[]): StatisticType => {
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
};

const drawStatistic = (statistic: StatisticType, isItemNext: boolean) => {
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

        return <Item key={result.roundId} result={result} col={col} row={row}></Item>;
    });

    if (isItemNext) {
        resultHandle.push(addNextMark(rowMax, row, col, nextCol));
    }

    return resultHandle;
};

const addNextMark = (rowMax, row, col, nextCol) => {
    const max = rowMax.hasOwnProperty(col) ? rowMax[col] : rowTotal;
    const randomKey = Math.random();
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

    return <ItemNext key={randomKey} col={col} row={row}></ItemNext>;
};

export default function Statistic(props: Props) {
    const { results, gameState } = props;
    const data: StatisticType = handleData(results);
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    const totalDiceRed = data.resultDiceRed.reduce(reducer);
    const wheel = (e) => {
        e.target.scrollLeft -= e.deltaY;
    };

    let mouseDown = false;
    let startX, scrollLeft;

    let startDragging = function (e) {
        mouseDown = true;
        startX = e.pageX - e.target.offsetLeft;
        scrollLeft = e.target.scrollLeft;
    };
    let stopDragging = function (e) {
        mouseDown = false;
    };

    const handleDragging = (e) => {
        e.preventDefault();
        if (!mouseDown) {
            return;
        }

        const x = e.pageX - e.target.offsetLeft;
        const scroll = x - startX;
        e.target.scrollLeft = scrollLeft - scroll;
    };

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
                    <span className={styles["number"]}>{Math.round((data.resultDiceRed[0] / totalDiceRed) * 100)}%</span>
                </div>
                <div>
                    <span className={styles["title"]}> Red 2</span>
                    <span className={styles["number"]}>{Math.round((data.resultDiceRed[1] / totalDiceRed) * 100)}%</span>
                </div>
                <div>
                    <span className={styles["title"]}> Red 3</span>
                    <span className={styles["number"]}>{Math.round((data.resultDiceRed[2] / totalDiceRed) * 100)}%</span>
                </div>
                <div>
                    <span className={styles["title"]}> Red 4</span>
                    <span className={styles["number"]}>{Math.round((data.resultDiceRed[3] / totalDiceRed) * 100)}%</span>
                </div>
            </div>
            <div className={styles["statistic-board"]}>
                <div className={styles["statistic-container"]}>
                    <div
                        className={styles["scoreboard-container"]}
                        onWheel={(e) => wheel(e)}
                        onMouseDown={(e) => startDragging(e)}
                        onMouseUp={(e) => stopDragging(e)}
                        onMouseLeave={(e) => stopDragging(e)}
                        onMouseMove={(e) => handleDragging(e)}
                    >
                        {gameState === GameState.LockingBet ? drawStatistic(data, true) : drawStatistic(data, false)}
                    </div>
                </div>
            </div>
        </div>
    );
}
