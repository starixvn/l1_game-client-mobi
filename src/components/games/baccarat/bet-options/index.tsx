import { useTranslation } from "next-i18next";
import React from "react";
import { useGameContext } from "../../../../contexts/game-context/game-context";
import BetOption from "../../../shared/bet-option";
import { GameState } from "../../../shared/game-base/type";
import { BaccaratConfigs } from "../baccarat-helper";
import { SettlementResult } from "../baccarat";
import Styles from "./bet-options.module.scss";

type Props = {
    settlementResult: SettlementResult;
    gameState: GameState;
    isShowWinningEffect: boolean;
};

const renderBetOptionByChoice = (
    choice: string,
    gameState: GameState,
    settlementResult: SettlementResult,
    isShowWinningEffect: boolean
) => {
    const { gameConfigs, gameSetting } = useGameContext();
    const { odds } = gameConfigs;
    const isHighLight = gameState !== GameState.LockingBet && settlementResult[choice];
    const { t } = useTranslation(gameSetting.gameName.toLowerCase());

    const renderLabel = (choice: string) => <div className={`${Styles["bet-choice-name"]} ${Styles[choice]}`}>{t(choice)}</div>;

    return (
        <BetOption
            choice={choice}
            odd={odds[choice]}
            isDisplayOdd={true}
            isHighlight={isHighLight}
            gameState={gameState}
            isShowWinningEffect={isShowWinningEffect}
        >
            {renderLabel(choice)}
        </BetOption>
    );
};

const BaccaratBetOptions: React.FunctionComponent<Props> = (props) => {
    const { gameState, settlementResult, isShowWinningEffect } = props;
    const { gameSetting } = useGameContext();
    const gameName = gameSetting.gameName.toLowerCase();

    return (
        <div className={`${Styles[`layout-${gameName}`]}`}>
            {BaccaratConfigs.choices.map((choice, index) => (
                <div key={index} className={Styles[`choice-${choice.style}`]}>
                    {renderBetOptionByChoice(choice.name, gameState, settlementResult, isShowWinningEffect)}
                </div>
            ))}
        </div>
    );
};

export default BaccaratBetOptions;
