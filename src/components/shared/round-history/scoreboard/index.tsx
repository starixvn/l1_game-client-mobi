import React from "react";
import Styles from "../round-history.module.scss";
import ItemNext from "./item-next";
import { StatisticItem } from "../type";
import { GameState } from "../../game-base/type";

type Props = {
    roundHistory: any[];
    gameState: number;
    getElementRound: (result: StatisticItem, col: number, row: number, roundId: number) => {};
    getDataFromChild: (settlementResult: any, resultDices: any, roundId: number) => {};
    isDragonTail: boolean;
};

const rowTotal = 7;
const drawDragonTailHistory = (statistic: StatisticItem[], getElementRound: Function, isItemNext: boolean) => {
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

        return getElementRound(result, col, row, result.roundId);
    });

    if (isItemNext) {
        resultHandle.push(addNextElement(rowMax, row, col, nextCol));
    }

    return resultHandle;
};
const addNextElement = (rowMax: {}, row: number, col: number, nextCol: number) => {
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

export default function RoundHistory(props: Props) {
    const { roundHistory, gameState, getElementRound, getDataFromChild, isDragonTail } = props;

    const renderRoundHistory = (history: any[], isBlockBet: boolean) => {
        const data: StatisticItem[] = history.map((value) => {
            const resultDices = value.result;
            const settlementResult = value.settlementResult;
            return getDataFromChild(settlementResult, resultDices, value.roundId) as StatisticItem;
        });
        if (isDragonTail) {
            if (isBlockBet) {
                return drawDragonTailHistory(data, getElementRound, true);
            } else {
                return drawDragonTailHistory(data, getElementRound, false);
            }
        } else {
            // console.log(data);
        }
    };

    const handleWheel = (e) => {
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

        const x: number = e.pageX - e.target.offsetLeft;
        const scroll: number = x - startX;
        e.target.scrollLeft = scrollLeft - scroll;
    };

    return (
        <div className={Styles["container"]}>
            <div className={Styles["statistic-board"]}>
                <div className={Styles["statistic-container"]}>
                    <div
                        className={Styles["scoreboard-container"]}
                        onWheel={(e) => handleWheel(e)}
                        onMouseDown={(e) => startDragging(e)}
                        onMouseUp={(e) => stopDragging(e)}
                        onMouseLeave={(e) => stopDragging(e)}
                        onMouseMove={(e) => handleDragging(e)}
                    >
                        {gameState === GameState.LockingBet
                            ? renderRoundHistory(roundHistory, true)
                            : renderRoundHistory(roundHistory, false)}
                    </div>
                </div>
            </div>
        </div>
    );
}
