import React from "react";
import { useTranslation } from "next-i18next";
import { GameState } from "../../../shared/game-base/type";
import RoundHistoryContainer from "../../../shared/round-history/container";
import RoundHistoryItem from "../../../shared/round-history/item";
import SeDieDot, { MiniItemNext } from "../dot";
import { Result, SettlementResult } from "../sedie";
import { Props } from "./mini-round-history";
import Styles from "./mini-round-history.module.scss";

const renderRoundDetail = (round: Round<Result, SettlementResult>) => {
    const { t } = useTranslation("xocxoc");
    const { roundId, settlementResult, result } = round;
    const totalDiceRed = 4;
    const countRed = countRedDot(result);

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

export const countRedDot = (result: Result) => Object.keys(result).reduce((total, key) => (result[key] ? total + 1 : total), 0);
export const checkIsEven = (numberOfRedDot: number) => numberOfRedDot % 2 > 0;
const MiniRoundHistory = (props: Props) => {
    const { gameState, roundHistory } = props;
    let numberOfItems = 21;
    const renderRounds = (numberOfItems: number) => {
        let listRound: JSX.Element[] = roundHistory.slice(0, numberOfItems).map((round, index) => (
            <RoundHistoryItem key={round.roundId} round={round} renderRoundDetail={renderRoundDetail(round)}>
                {gameState === GameState.LockingBet && index === numberOfItems - 1 ? (
                    <MiniItemNext></MiniItemNext>
                ) : (
                    <SeDieDot red={checkIsEven(countRedDot(round.result))} />
                )}
            </RoundHistoryItem>
        ));
        return listRound;
    };

    return <RoundHistoryContainer>{renderRounds(numberOfItems)}</RoundHistoryContainer>;
};

export default MiniRoundHistory;
