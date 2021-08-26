import { useTranslation } from "next-i18next";
import React from "react";

import { useGameContext } from "../../../../contexts/game-context/game-context";
import BetOption from "../../../shared/bet-option";
import { GameState } from "../../../shared/game-base/type";
import { SettlementResult } from "../baccarat";
import { BaccaratConfigs } from "../baccarat-helper";
import Styles from "./bet-options.module.scss";

type Props = {
    settlementResult: SettlementResult;
    gameState: GameState;
    isShowWinningEffect: boolean;
};

const renderBetOptionByChoice = (
    choice: string,
    label: string,
    odd: number,
    isHighLight: boolean,
    gameState: GameState,
    isShowWinningEffect: boolean
) => {
    return (
        <BetOption
            choice={choice}
            odd={odd}
            isDisplayOdd={true}
            isHighlight={isHighLight}
            gameState={gameState}
            isShowWinningEffect={isShowWinningEffect}
        >
            <div className={`${Styles["bet-choice-name"]} ${Styles[choice]}`}>{label}</div>
        </BetOption>
    );
};

const BaccaratBetOptions: React.FunctionComponent<Props> = (props) => {
    const { gameState, settlementResult, isShowWinningEffect } = props;
    const { gameSetting, gameConfigs } = useGameContext();
    const gameName = gameSetting.gameName.toLowerCase();
    const { t } = useTranslation(gameSetting.gameName.toLowerCase());
    const { odds } = gameConfigs;

    return (
        <div className={Styles[`layout-${gameName}`]}>
            {BaccaratConfigs.choices.map((choice, index) => {
                const isHighLight = gameState !== GameState.LockingBet && settlementResult[choice.name];
                return (
                    <div key={index} className={Styles[`choice-${choice.style}`]}>
                        {renderBetOptionByChoice(
                            choice.name,
                            t(choice.name),
                            odds[choice.name],
                            isHighLight,
                            gameState,
                            isShowWinningEffect
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default BaccaratBetOptions;
