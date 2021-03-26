import React, { useState } from "react";
import Styles from "../round-history.module.scss";
import ToolTipModal, { ToolTipChild } from "../../../shared/tool-tip";
import { MiniRoundHistoryType } from "../../../shared/round-history/type";
import { GameState } from "../../../shared/game-base/type";
import { MiniItemNext } from "./mini-item-next";

type PropsMini = {
    round: MiniRoundHistoryType;
    classNameDice: string[];
    renderToolTipItem: Function;
};

const MiniRoundElement = (props: PropsMini) => {
    const { round, classNameDice, renderToolTipItem } = props;
    const [tooltipIsOpen, setIsTooltipOpen] = useState(false);
    const openToolTip = () => {
        setIsTooltipOpen(!tooltipIsOpen);
    };
    return (
        <div key={round.roundId} className={classNameDice[round.type]} onClick={() => openToolTip()}>
            <ToolTipModal isOpen={tooltipIsOpen} onClose={openToolTip}>
                {tooltipIsOpen && <ToolTipChild key={"tip" + round.roundId}>{renderToolTipItem}</ToolTipChild>}
            </ToolTipModal>
        </div>
    );
};

type PropMain = {
    gameState: number;
    roundHistory: any;
    countItem: number;
    diceType: string[];
    renderToolTipItem: Function;
    classNameDice: string[];
};

const MiniRoundHistory = (props: PropMain) => {
    const { gameState, roundHistory, countItem, diceType, renderToolTipItem, classNameDice } = props;
    const data: MiniRoundHistoryType[] = getDataHistoryRound(roundHistory, countItem, diceType);
    let listRoundDot = data.map((round) => {
        return (
            <MiniRoundElement
                key={round.roundId}
                round={round}
                classNameDice={classNameDice}
                renderToolTipItem={renderToolTipItem(round)}
            ></MiniRoundElement>
        );
    });
    if (gameState === GameState.LockingBet) {
        listRoundDot.pop();
        listRoundDot.push(<MiniItemNext key={Math.random()}></MiniItemNext>);
    }
    return (
        <div className={Styles["mini-statistic-container"]}>
            <div className={Styles["line-container"]}>{listRoundDot}</div>
        </div>
    );
};

const countDiceColor = (result, diceType) => {
    let countType = 0;
    diceType.forEach((type) => {
        if (result[type]) {
            countType++;
        }
    });

    return countType;
};

export const getDataHistoryRound = (roundHistory, countItem, diceType): MiniRoundHistoryType[] => {
    const dataFilter = roundHistory.slice(0, countItem);
    const result = [...dataFilter].reverse();
    return result.map(
        (round: MiniRoundHistoryType): MiniRoundHistoryType => {
            const dataTemplate: MiniRoundHistoryType = {
                type: 0,
                settlementResult: [],
                roundId: 0,
                result: {},
            };
            const countType = countDiceColor(round.result, diceType);

            if (countType % 2) {
                dataTemplate.type = 0;
            } else {
                dataTemplate.type = 1;
            }

            dataTemplate.settlementResult = round.settlementResult;
            dataTemplate.roundId = round.roundId;
            dataTemplate.result = round.result;

            return dataTemplate;
        }
    );
};

export default MiniRoundHistory;
