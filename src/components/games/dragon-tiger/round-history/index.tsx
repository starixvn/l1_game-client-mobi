import { useTranslation } from "next-i18next";
import React from "react";
import { isTablet } from "react-device-detect";

import { useGameContext } from "../../../../contexts/game-context/game-context";
import { Round } from "../../../../types";
import { GameState } from "../../../shared/game-base/type";
import RoundHistoryItem from "../../../shared/round-history/item";
import { MiniItemNext } from "../../../shared/round-history/item-next";
import DragonTigerDot from "../dot";
import { Result, SettlementResult } from "../dragon-tiger";
import { Props } from "./mini-round-history";
import Styles from "./mini-round-history.module.scss";

const renderRoundDetail = (round: Round<Result, SettlementResult>, t: Function) => {
    const { roundId, settlementResult, result } = round;

    const choiceResult = { dragon: {}, tiger: {} };
    ["dragon", "tiger"].forEach((name) => {
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
    const { gameSetting } = useGameContext();
    const { t } = useTranslation("dragontiger");
    const isLockingBet = () => gameState === GameState.LockingBet;
    let numberOfItems = isLockingBet() ? 20 : 21;
    if (isTablet) {
        numberOfItems = numberOfItems - 2;
    }
    const rounds = roundHistory.slice(0, numberOfItems).reverse();

    return (
        <>
            {rounds.map((round, index) => (
                <RoundHistoryItem
                    key={round.roundId}
                    renderRoundDetail={renderRoundDetail(round, t)}
                    targetName={`${gameSetting.gameName.toLowerCase()}-${round.roundId}`}
                >
                    <DragonTigerDot choice={round.settlementResult} highlight={!isLockingBet() && index == numberOfItems - 1} />
                </RoundHistoryItem>
            ))}
            {isLockingBet() && <MiniItemNext></MiniItemNext>}
        </>
    );
};

export default DragonTigerRoundHistory;
