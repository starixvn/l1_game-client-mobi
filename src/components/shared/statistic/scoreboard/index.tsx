import React from "react";
import styles from "../statistic.module.scss";
import ItemNext from "./item-next";
import { StatisticItem } from "../type";
import { GameState } from "../../game-base/type";

type Props = {
    results: any[];
    gameState: number;
    itemStatistic: (result: StatisticItem, col: number, row: number, roundId: number) => {};
    convertDataStatistic: (settlementResult: any, resultDices: any, roundId: number) => {};
};

const rowTotal = 7;

const addNextMark = (rowMax: {}, row: number, col: number, nextCol: number) => {
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
    const { results, gameState, itemStatistic, convertDataStatistic } = props;
    const drawStatistic = (statistic: StatisticItem[], isItemNext: boolean) => {
        let col = 1,
            row = 1;
        let nextCol = 1;
        let previousResult = undefined;
        const rowMax = {};
        let colMax = 0;
        const data = [...statistic].reverse();

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

            return itemStatistic(result, col, row, result.roundId);
        });

        if (isItemNext) {
            resultHandle.push(addNextMark(rowMax, row, col, nextCol));
        }

        return resultHandle;
    };

    const handleData = (history: any[]) => {
        const data: StatisticItem[] = history.map((value) => {
            const resultDices = value.result;
            const settlementResult = value.settlementResult;
            return convertDataStatistic(settlementResult, resultDices, value.roundId) as StatisticItem;
        });

        if (gameState === GameState.LockingBet) {
            return drawStatistic(data, true);
        } else {
            return drawStatistic(data, false);
        }
    };

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
                        {/* {gameState === GameState.LockingBet ? drawStatistic(data, true) : drawStatistic(data, false)} */}
                        {handleData(results)}
                    </div>
                </div>
            </div>
        </div>
    );
}
