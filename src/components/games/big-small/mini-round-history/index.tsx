import React from "react";
import { useTranslation } from "next-i18next";
import { GameState } from "../../../shared/game-base/type";
import RoundHistoryContainer from "../../../shared/round-history/container";
import RoundHistoryItem from "../../../shared/round-history/item";
import BigSmallDot, { MiniItemNext } from "../dot";
import { BigSmallResult, BigSmallSettlementResult } from "../big-small";
import { Props } from "./mini-round-history";
import Styles from "./mini-round-history.module.scss";

const renderRoundDetail = (round: Round<BigSmallResult, BigSmallSettlementResult>) => {
    const { t } = useTranslation("taixiu");
    const { roundId, settlementResult, result } = round;
    const ResultValue = Object.values(result);

    return (
        <div>
            <span className={Styles["tooltip-round"]}>#{roundId}</span>
            <div>
                <span className={Styles["tooltip-title"]}>
                    {settlementResult.big ? t("big") : t("small")}(
                    {ResultValue.map((value) => {
                        return value + "-";
                    })}
                    )
                </span>
                <div className={Styles["tooltip-display"]}></div>
            </div>
        </div>
    );
};

const MiniRoundHistory = (props: Props) => {
    const { gameState, roundHistory } = props;
    let numberOfItems = 21;
    const renderRounds = (numberOfItems: number) => {
        let listRound: JSX.Element[] = roundHistory
            .slice(0, numberOfItems)
            .reverse()
            .map((round, index) => (
                <RoundHistoryItem key={round.roundId} round={round} renderRoundDetail={renderRoundDetail(round)}>
                    {gameState === GameState.LockingBet && index === numberOfItems - 1 ? (
                        <MiniItemNext></MiniItemNext>
                    ) : (
                        <BigSmallDot red={round.settlementResult.small} />
                    )}
                </RoundHistoryItem>
            ));
        return listRound;
    };

    return <RoundHistoryContainer>{renderRounds(numberOfItems)}</RoundHistoryContainer>;
};

export default MiniRoundHistory;
