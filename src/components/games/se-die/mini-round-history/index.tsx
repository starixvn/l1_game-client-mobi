import React, { useState } from "react";
import ToolTipModal, { ToolTipChild } from "../../../shared/tool-tip";
import Styles from "./../se-die-statistic.module.scss";
import { useTranslation } from "next-i18next";
import { MiniItemNext } from "../../../shared/round-history/line/mini-item-next";
import { GameState } from "../../../shared/game-base/type";
import { MiniRoundHistoryType } from "../../../shared/round-history/type";

export type PropsMiniRound = {
    round: MiniRoundHistoryType;
};

export type Props = {
    roundHistory: [];
    countItem: number;
    gameState: number;
};

export enum DiceTypeColor {
    red,
    white,
}

export const typeDiceResult = ["red1", "red2", "red3", "red4"];

const countDiceRed = (result) => {
    let countType = 0;
    typeDiceResult.forEach((type) => {
        if (result[type]) {
            countType++;
        }
    });

    return countType;
};

const ToolTipItem = (props: PropsMiniRound) => {
    const { t } = useTranslation("xocxoc");
    const { roundId, settlementResult, result } = props.round;
    const totalDiceRed = 4;
    const countRed = countDiceRed(result);

    return (
        <div>
            <span className={Styles["tooltip-round"]}>#{roundId}</span>
            <div>
                <span className={Styles["tooltip-title"]}>{settlementResult.even ? t("even") : t("odd")}</span>
                <div className={Styles["tooltip-display"]}>
                    <span className={Styles["tooltip-dice-red"]}></span>
                    <span className={Styles["tooltip-number"]}>{countRed}</span>
                </div>
                <div className={Styles["tooltip-display"]}>
                    <span className={Styles["tooltip-dice-white"]}></span>
                    <span className={Styles["tooltip-number"]}>{totalDiceRed - countRed}</span>
                </div>
            </div>
        </div>
    );
};

const MiniRound = (props: Props) => {
    const { roundHistory, countItem, gameState } = props;
    const keyRandom = Math.random();
    const data: MiniRoundHistoryType[] = getDataHistoryRound(roundHistory, countItem);
    let listMiniRound = data.map((round) => {
        return <MiniRoundElement key={round.roundId} round={round}></MiniRoundElement>;
    });

    if (gameState === GameState.LockingBet) {
        listMiniRound.pop();
        listMiniRound.push(<MiniItemNext key={keyRandom}></MiniItemNext>);
    }

    return listMiniRound;
};

const MiniRoundElement = (props: PropsMiniRound) => {
    const { round } = props;
    const [tooltipIsOpen, setIsTooltipOpen] = useState(false);
    const className = round.type === DiceTypeColor.red ? "mini-item-red" : "mini-item-white";
    const openToolTip = () => {
        setIsTooltipOpen(!tooltipIsOpen);
    };
    const closeToolTip = () => {
        setIsTooltipOpen(false);
    };
    return (
        <div key={round.roundId} className={`${Styles[className]}`} onClick={() => openToolTip()}>
            <ToolTipModal isOpen={tooltipIsOpen} onClose={closeToolTip}>
                {tooltipIsOpen && (
                    <ToolTipChild key={"tip" + round.roundId}>
                        <ToolTipItem round={round}></ToolTipItem>
                    </ToolTipChild>
                )}
            </ToolTipModal>
        </div>
    );
};

export const getDataHistoryRound = (roundHistory, countItem): MiniRoundHistoryType[] => {
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
            const countType = countDiceRed(round.result);

            if (countType % 2) {
                dataTemplate.type = DiceTypeColor.red;
            } else {
                dataTemplate.type = DiceTypeColor.white;
            }

            dataTemplate.settlementResult = round.settlementResult;
            dataTemplate.roundId = round.roundId;
            dataTemplate.result = round.result;

            return dataTemplate;
        }
    );
};

export default MiniRound;
