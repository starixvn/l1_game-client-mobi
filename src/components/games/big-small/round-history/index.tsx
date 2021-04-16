import { useTranslation } from "next-i18next";
import React from "react";

import { Round } from "../../../../types";
import { GameState } from "../../../shared/game-base/type";
import RoundHistoryItem from "../../../shared/round-history/item";
import { Result, SettlementResult } from "../big-small";
import BigSmallDot, { MiniItemNext } from "../dot";
import { Props } from "./mini-round-history";
import Styles from "./mini-round-history.module.scss";

export const countRedDot = (result: Result) => Object.values(result).reduce((total, value) => total + value, 0);
export const checkIsSmall = (numberOfRed: number) => numberOfRed <= 10;

const renderRoundDetail = (round: Round<Result, SettlementResult>, t: Function) => {
    const { roundId, settlementResult, result } = round;
    const ResultValue = Object.values(result);

    return (
        <div>
            <span className={Styles["tooltip-round"]}>#{roundId}</span>
            <div>
                <span className={Styles["tooltip-title"]}>
                    {settlementResult.big ? t("big") : t("small")} (
                    {ResultValue.map((value, index, arr) => {
                        if (arr.length - 1 === index) {
                            return value;
                        } else {
                            return value + "-";
                        }
                    })}
                    )
                </span>
                <div className={Styles["tooltip-display"]}></div>
            </div>
        </div>
    );
};

const BigSmallRoundHistory = (props: Props) => {
    const { gameState, roundHistory } = props;
    const { t } = useTranslation("taixiu");
    const isLockingBet = () => gameState === GameState.LockingBet;
    const numberOfItems = isLockingBet() ? 20 : 21;
    const rounds = roundHistory.slice(0, numberOfItems).reverse();

    return (
        <>
            {rounds.map((round) => (
                <RoundHistoryItem key={round.roundId} renderRoundDetail={renderRoundDetail(round, t)}>
                    <BigSmallDot red={round.settlementResult.small} />
                </RoundHistoryItem>
            ))}
            {isLockingBet() && <MiniItemNext></MiniItemNext>}
        </>
    );
};

export default BigSmallRoundHistory;
