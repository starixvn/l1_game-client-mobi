import { useTranslation } from "next-i18next";
import React from "react";

import { useGameContext } from "../../../../contexts/game-context/game-context";
import BetOption from "../../../shared/bet-option";
import { GameState } from "../../../shared/game-base/type";
import { SettlementResult } from "../three-cards";
import { Choices } from "../three-cards-helper";
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
    gameState: GameState,
    isHighLight: boolean,
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

const ThreeCardsBetOptions: React.FunctionComponent<Props> = (props) => {
    const { gameState, settlementResult, isShowWinningEffect } = props;
    const { gameConfigs, gameSetting } = useGameContext();
    const { odds } = gameConfigs;

    const { t } = useTranslation(gameSetting.gameName.toLowerCase());

    return (
        <div className={`${Styles["layout-three-cards"]}`}>
            {Object.keys(Choices).map((choice, index) => {
                const isHighLight = gameState !== GameState.LockingBet && settlementResult[choice];
                return (
                    <div key={index} className={Styles[`choice-${choice}`]}>
                        {renderBetOptionByChoice(choice, t(choice), odds[choice], gameState, isHighLight, isShowWinningEffect)}
                    </div>
                );
            })}
        </div>
    );
};

export default ThreeCardsBetOptions;
