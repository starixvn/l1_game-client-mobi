import { useTranslation } from "next-i18next";
import React from "react";

import { Round } from "../../../../types";
import { GameState } from "../../../shared/game-base/type";
import RoundHistoryItem from "../../../shared/round-history/item";
import { Result, SettlementResult } from "../big-small";
import BigSmallDot from "../dot";
import { MiniItemNext } from "../../../shared/round-history/item-next";
import { useGameContext } from "../../../../contexts/game-context/game-context";
import { Props } from "./mini-round-history";
import Styles from "./mini-round-history.module.scss";

const renderRoundDetail = (round: Round<Result, SettlementResult>, t: Function) => {
    const { roundId, settlementResult, result } = round;
    const ResultValue = Object.values(result);

    return (
        <>
            <span className={Styles["tooltip-round"]}>#{roundId}</span>
            <div>
                <span className={Styles["tooltip-title"]}>
                    {settlementResult.big ? t("big") : t("small")} (
                    {ResultValue.map((value, index, arr) => {
                        if (arr.length - 1 === index) {
                            return value;
                        } else {
                            return `${value}-`;
                        }
                    })}
                    )
                </span>
                <div className={Styles["tooltip-display"]}></div>
            </div>
        </>
    );
};

const BigSmallRoundHistory = (props: Props) => {
    const { gameState, roundHistory } = props;
    const { gameSetting } = useGameContext();
    const { t } = useTranslation("taixiu");
    const isLockingBet = () => gameState === GameState.LockingBet;
    const numberOfItems = isLockingBet() ? 20 : 21;
    const rounds = roundHistory.slice(0, numberOfItems).reverse();

    return (
        <>
            {rounds.map((round) => (
                <RoundHistoryItem key={round.roundId} renderRoundDetail={renderRoundDetail(round, t)} targetName={`${gameSetting.gameName.toLowerCase()}-${round.roundId}`}>
                    <BigSmallDot red={round.settlementResult.small} />
                </RoundHistoryItem>
            ))}
            {isLockingBet() && <MiniItemNext></MiniItemNext>}
        </>
    );
};

export default BigSmallRoundHistory;
