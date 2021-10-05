import { useTranslation } from "next-i18next";
import React from "react";

import { useGameContext } from "../../../../contexts/game-context/game-context";
import BetOption from "../../../shared/bet-option";
import { GameState } from "../../../shared/game-base/type";
import { SettlementResult } from "../keno-pro-max";
import { Choices } from "../keno-pro-max-helper";
import Styles from "./bet-options.module.scss";

type Props = {
    settlementResult: SettlementResult;
    gameState: GameState;
    isShowWinningEffect: boolean;
};

const choiceWithoutTooltip = ["odd", "even"];
const tooltipMessageFollowChoice = {
    big: `[811~1410]`,
    small: `[210~810]`,
    gold: `[210~695]`,
    wood: `[696~763]`,
    water: `[764~855]`,
    fire: `[856~923]`,
    earth: `[924~1410]`,
};

const renderBetOptionByChoice: React.FC<{
    choice: string;
    label: string;
    odd: number;
    gameState: GameState;
    isHighLight: boolean;
    isShowWinningEffect: boolean;
    tooltipMessage: string;
}> = ({ choice, label, odd, gameState, isHighLight, isShowWinningEffect, tooltipMessage }) => {
    return (
        <BetOption
            choice={choice}
            odd={odd}
            isDisplayOdd={true}
            isHighlight={isHighLight}
            gameState={gameState}
            isShowWinningEffect={isShowWinningEffect}
            isShowTooltip={!choiceWithoutTooltip.includes(choice)}
            tooltipMessage={tooltipMessage}
        >
            <div className={`${Styles["bet-choice-name"]} ${Styles[choice]}`}>{label}</div>
        </BetOption>
    );
};

const KenoProMaxBetOptions: React.FunctionComponent<Props> = (props) => {
    const { gameState, settlementResult, isShowWinningEffect } = props;
    const { gameConfigs, gameSetting } = useGameContext();
    const { odds } = gameConfigs;

    const { t } = useTranslation(gameSetting.gameName.toLowerCase());
    return (
        <div className={`${Styles["layout-keno-pro-max"]}`}>
            {Object.keys(Choices).map((choice, index) => {
                const isHighLight = gameState !== GameState.LockingBet && settlementResult[choice];
                return (
                    <div key={index} className={Styles[`choice-${choice}`]}>
                        {renderBetOptionByChoice({
                            choice,
                            label: t(choice),
                            odd: odds[choice],
                            gameState,
                            isHighLight,
                            isShowWinningEffect,
                            tooltipMessage: tooltipMessageFollowChoice[choice],
                        })}
                    </div>
                );
            })}
        </div>
    );
};

export default KenoProMaxBetOptions;
