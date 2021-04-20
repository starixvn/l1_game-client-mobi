import React from "react";
import { GameState } from "../../../game-base/type";
import { RoundHistoryType } from "../../type";
import Styles from "../round-history.module.scss";

type Props = {
    roundHistory: any[];
    gameState: number;
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
    const resultHandle = roundHistory.map((round: RoundHistoryType) => {
        if (checkCondition) {
            const value = checkCondition(round.settlementResult);
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
        return <></>;
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
const ScoreboardDragon = (props: Props) => {
    const { roundHistory, gameState, getElementRound, checkCondition, roundNext } = props;
    let isBlockBet = false;
    const renderRoundHistory = (roundHistory) => {
        if (gameState === GameState.LockingBet) {
            isBlockBet = true;
        }
        return drawDragonTailHistory(roundHistory, getElementRound, checkCondition, isBlockBet, roundNext);
    };

    return <div className={Styles["score-board-dragon-container"]}>{renderRoundHistory([...roundHistory].reverse())}</div>;
};

export default ScoreboardDragon;
