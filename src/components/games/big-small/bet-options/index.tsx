import { useTranslation } from "next-i18next";
import React from "react";

import { useGameContext } from "../../../../contexts/game-context/game-context";
import BetOption from "../../../shared/bet-option";
import { GameState } from "../../../shared/game-base/type";
import { SettlementResult } from "../big-small";
import Styles from "./bet-options.module.scss";

const Choices = {
    big: "big",
    small: "small",
};

type Props = {
    settlementResult: SettlementResult;
    gameState: GameState;
    betPercentage: object;
};

const renderBetOptionByChoice = (choice: string, gameState: GameState, settlementResult: SettlementResult, betPercentage: object) => {
    const { gameConfigs, gameSetting } = useGameContext();
    const { t } = useTranslation(gameSetting.gameName.toLowerCase());
    const { odds } = gameConfigs;

    return (
        <BetOption choice={choice} odd={odds[choice]} isHighlight={settlementResult[choice]} gameState={gameState}>
            <div className={Styles[choice]}>
                {t(choice)}
                <div className={Styles["statistic-user-bet"]}>
                    <span className={`icon-user-group ${Styles["user-group"]}`}></span>
                    <span className={Styles["number"]}>{betPercentage && betPercentage[choice] ? betPercentage[choice] : 0}%</span>
                </div>
            </div>
        </BetOption>
    );
};

const BigSmallBetOptions: React.FunctionComponent<Props> = (props) => {
    const { gameState, settlementResult, betPercentage } = props;
    return (
        <div className={`bet-options-container ${Styles["layout-BS"]}`}>
            <div>{renderBetOptionByChoice(Choices.big, gameState, settlementResult, betPercentage)}</div>
            <div>{renderBetOptionByChoice(Choices.small, gameState, settlementResult, betPercentage)}</div>
        </div>
    );
};

export default BigSmallBetOptions;
