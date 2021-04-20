import { useTranslation } from "next-i18next";
import React from "react";

import { Round } from "../../../../types";
import { GameState } from "../../../shared/game-base/type";
import RoundHistoryItem from "../../../shared/round-history/item";
import { Result, SettlementResult } from "../dragon-tiger";
import DragonTigerDot from "../dot";
import { MiniItemNext } from "../../../shared/round-history/item-next";
import { Props } from "./mini-round-history";
import Styles from "./mini-round-history.module.scss";

const choice = ["dragon", "tiger"];
const getValueCard = (result: Result, name: string) => {
    return result[name].card;
};

export const checkIsDragon = (result: Result) => {
    return getValueCard(result, choice[0]) > getValueCard(result, choice[1]);
};
export const checkIsTie = (result: Result) => {
    return getValueCard(result, choice[0]) === getValueCard(result, choice[1]);
};

const renderRoundDetail = (round: Round<Result, SettlementResult>, t: Function) => {
    const { roundId, settlementResult, result } = round;

    const choiceResult = { dragon: {}, tiger: {} };
    choice.forEach((name) => {
        choiceResult[name] = Object.values(result[name]).map((value) => {
            return `${value} `;
        });
    });

    return (
        <div>
            <span className={Styles["tooltip-round"]}>#{roundId}</span>
            <div>
                <span className={Styles["tooltip-title"]}>
                    {settlementResult.tie ? t("tie") : settlementResult.dragon ? t("dragon") : t("tiger")} {choiceResult.dragon} |
                    {choiceResult.tiger}
                </span>
                <div className={Styles["tooltip-display"]}></div>
            </div>
        </div>
    );
};

const DragonTigerRoundHistory = (props: Props) => {
    const { gameState, roundHistory } = props;
    const { t } = useTranslation("dragontiger");
    const isLockingBet = () => gameState === GameState.LockingBet;
    const numberOfItems = isLockingBet() ? 20 : 21;
    const rounds = roundHistory.slice(0, numberOfItems).reverse();

    return (
        <>
            {rounds.map((round) => (
                <RoundHistoryItem key={round.roundId} renderRoundDetail={renderRoundDetail(round, t)}>
                    <DragonTigerDot choice={round.settlementResult} />
                </RoundHistoryItem>
            ))}
            {isLockingBet() && <MiniItemNext></MiniItemNext>}
        </>
    );
};

export default DragonTigerRoundHistory;
