import React from "react";
import Styles from "./round-history.module.scss";
import { GameState } from "../../game-base/type";
import { RoundHistoryType } from "../type";

type Props = {
    roundHistory: any[];
    gameState: number;
    isDragonTail: boolean;
    getElementRound: Function;
    checkCondition?: Function;
    roundNext?: Function;
};

const rowTotal = 7;
const drawDragonTailHistory = (
    roundHistory: any[],
    getElementRound: Function,
    checkCondition: Function,
    isItemNext: boolean,
    roundNext: Function
) => {
    let col = 1,
        row = 1;
    let nextCol = 1;
    let previousResult = undefined;
    const rowMax = {};
    let colMax = 0;
    let resultHandle = roundHistory.map((round: RoundHistoryType) => {
        if (checkCondition) {
            let value = checkCondition(round.settlementResult);
            if (value === previousResult) {
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
            previousResult = value;

            return getElementRound(round.result, col, row, round.roundId);
        }
    });

    if (isItemNext && roundNext) {
        resultHandle.push(addNextElement(rowMax, row, col, nextCol, roundNext));
    }

    return resultHandle;
};
const addNextElement = (rowMax: {}, row: number, col: number, nextCol: number, roundNext: Function) => {
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

    return roundNext(col, row);
};

const drawHistory = (roundHistory, getElementRound) => {
    return roundHistory.map((round: RoundHistoryType) => {
        return getElementRound(round.result, round.roundId);
    });
};

const ScoreboardRoundHistory = (props: Props) => {
    const { roundHistory, gameState, isDragonTail, getElementRound, checkCondition, roundNext } = props;
    const dataOrder = [...roundHistory].reverse();
    const renderRoundHistory = (roundHistory) => {
        if (isDragonTail) {
            let isBlockBet = false;
            if (gameState === GameState.LockingBet) {
                isBlockBet = true;
            }
            return drawDragonTailHistory(roundHistory, getElementRound, checkCondition, isBlockBet, roundNext);
        } else {
            return drawHistory(roundHistory, getElementRound);
        }
    };

    const handleWheel = (e) => {
        console.log(e.deltaY);
        console.log(e.target);
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
        <div
            className={isDragonTail ? Styles["scoreboard-dragon-container"] : Styles["scoreboard-container"]}
            onWheel={(e) => handleWheel(e)}
            onMouseDown={(e) => startDragging(e)}
            onMouseUp={(e) => stopDragging(e)}
            onMouseLeave={(e) => stopDragging(e)}
            onMouseMove={(e) => handleDragging(e)}
        >
            {renderRoundHistory(dataOrder)}
        </div>
    );
};

export default ScoreboardRoundHistory;
