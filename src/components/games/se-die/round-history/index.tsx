import { useTranslation } from "next-i18next";
import React from "react";

import { Round } from "../../../../types";
import { GameState } from "../../../shared/game-base/type";
import RoundHistoryItem from "../../../shared/round-history/item";
import SeDieDot from "../dot";
import { MiniItemNext } from "../../../shared/round-history/item-next";
import { checkIsEven, countRedDot } from "../se-die-helper";
import { Result, SettlementResult } from "../sedie";
import { Props } from "./mini-round-history";
import { useGameContext } from "../../../../contexts/game-context/game-context";
import Styles from "./mini-round-history.module.scss";

const renderRoundDetail = (round: Round<Result, SettlementResult>, t: Function) => {
    const { roundId, settlementResult, result } = round;
    const totalDiceRed = 4;
    const countRed = countRedDot(result);

    return (
        <div>
            <div className={Styles["tooltip-roundID"]}>#{roundId}</div>
            <div className={Styles["tooltip-content"]}>
                <span className={Styles["tooltip-result"]}>{settlementResult.even ? t("even") : t("odd")}</span>
                <div className={Styles["tooltip-group"]}>
                    <span className={Styles["dot-red"]}></span>
                    <span className={Styles["number"]}>{countRed}</span>
                </div>
                <div className={Styles["tooltip-group"]}>
                    <span className={Styles["dot-white"]}></span>
                    <span className={Styles["number"]}>{totalDiceRed - countRed}</span>
                </div>
            </div>
        </div>
    );
};

const SeDieRoundHistory = (props: Props) => {
    const { gameState, roundHistory } = props;
    const { gameSetting } = useGameContext();
    const { t } = useTranslation("xocxoc");
    const isLockingBet = () => gameState === GameState.LockingBet;
    const numberOfItems = isLockingBet() ? 20 : 21;
    const rounds = roundHistory.slice(0, numberOfItems).reverse();

    return (
        <>
            {rounds.map((round) => (
                <RoundHistoryItem key={round.roundId} renderRoundDetail={renderRoundDetail(round, t)} targetName={`${gameSetting.gameName.toLowerCase()}-${round.roundId}`}>
                    <SeDieDot red={checkIsEven(countRedDot(round.result))}/>
                </RoundHistoryItem>
            ))}
            {isLockingBet() && <MiniItemNext></MiniItemNext>}
        </>
    );
};

export default SeDieRoundHistory;
