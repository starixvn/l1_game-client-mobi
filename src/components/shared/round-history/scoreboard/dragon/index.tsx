import React from "react";
import { GameState } from "../../../game-base/type";
import { RoundHistoryType } from "../../type";
import Styles from "../round-history.module.scss";
import { ScoreboardItemNext } from "../../item-next";

type Props = {
    roundHistory: any[];
    gameState: number;
    getElementRound: Function;
    checkCondition?: Function;
};

const rowTotal = 7;

const checkConditionBase = (settlementResult: object) => {
    let value = 0;
    Object.keys(settlementResult).forEach((name, index) => {
        if (settlementResult[name]) {
            value = index;
        }
    });

    return value;
};

const drawDragonTailHistory = (
    roundHistory: any[],
    getElementRound: Function,
    isItemNext: boolean,
    roundNext: Function,
    checkCondition: Function
) => {
    let col = 1,
        row = 1;
    let nextCol = 1;
    let previousResult = undefined;
    const rowMax = {};
    let colMax = 0;
    const resultHandle = roundHistory.map((round: RoundHistoryType) => {
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
    const { roundHistory, gameState, getElementRound } = props;
    let { checkCondition } = props;
    if (!checkCondition) {
        checkCondition = checkConditionBase;
    }
    const roundNext = (col: number, row: number) => {
        return <ScoreboardItemNext key={Math.random()} col={col} row={row}></ScoreboardItemNext>;
    };

    let isBlockBet = false;
    const renderRoundHistory = (roundHistory) => {
        if (gameState === GameState.LockingBet) {
            isBlockBet = true;
        }
        return drawDragonTailHistory(roundHistory, getElementRound, isBlockBet, roundNext, checkCondition);
    };

    return <div className={Styles["score-board-dragon-container"]}>{renderRoundHistory([...roundHistory].reverse())}</div>;
};

export default ScoreboardDragon;
