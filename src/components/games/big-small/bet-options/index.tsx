import { useTranslation } from "next-i18next";
import React from "react";

import { useGameContext } from "../../../../contexts/game-context/game-context";
import BetOption from "../../../shared/bet-option";
import { GameState } from "../../../shared/game-base/type";
import { SettlementResult } from "../big-small";
import { Choices } from "../big-small-helper";
import Styles from "./bet-options.module.scss";

type Props = {
    settlementResult: SettlementResult;
    gameState: GameState;
    betPercentage: object;
    isShowWinningEffect: boolean;
};

const BigSmallBetOptions: React.FunctionComponent<Props> = (props) => {
    const { gameState, settlementResult, betPercentage, isShowWinningEffect } = props;
    const { gameConfigs, gameSetting } = useGameContext();
    const { t } = useTranslation(gameSetting.gameName.toLowerCase());
    const { odds } = gameConfigs;
    return (
        <div className={`bet-options-container ${Styles["layout-BS"]}`}>
            {Object.keys(Choices).map((choice, index) => {
                return (
                    <BetOption
                        key={index}
                        choice={choice}
                        odd={odds[choice]}
                        isHighlight={settlementResult[choice]}
                        gameState={gameState}
                        isShowWinningEffect={isShowWinningEffect}
                    >
                        <div className={Styles[choice]}>
                            {t(choice)}
                            <div className={Styles["statistic-user-bet"]}>
                                <span className={`icon-user-group ${Styles["user-group"]}`}></span>
                                <span className={Styles["number"]}>
                                    {betPercentage && betPercentage[choice] ? betPercentage[choice] : 0}%
                                </span>
                            </div>
                        </div>
                    </BetOption>
                );
            })}
        </div>
    );
};

export default BigSmallBetOptions;
