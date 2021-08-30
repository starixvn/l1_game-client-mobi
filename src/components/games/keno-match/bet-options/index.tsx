import { useTranslation } from "next-i18next";
import React from "react";

import { useGameContext } from "../../../../contexts/game-context/game-context";
import BetOption from "../../../shared/bet-option";
import { GameState } from "../../../shared/game-base/type";
import { SettlementResult, KenoMatchGameStateEnum, KenoMatchGameState } from "../type";
import { KenoMatchConfigs } from "../keno-match-helper";
import Styles from "./bet-options.module.scss";
import {choicesMapper} from "../keno-match-helper";

type Props = {
    settlementResult: SettlementResult;
    gameState: GameState;
    isShowWinningEffect: boolean;
    activeHalfTimeResult: boolean;
};

const renderBetOptionByChoice = (
    choice: string,
    label: string,
    odd: number,
    isHighLight: boolean,
    gameState: GameState,
    isShowWinningEffect: boolean
) => {
    console.log(`${choice}: ${isHighLight}`);
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

const KenoMatchBetOptions: React.FunctionComponent<Props> = (props) => {
    const { gameState, settlementResult, isShowWinningEffect, activeHalfTimeResult } = props;
    const kenoMatchGameState = gameState as KenoMatchGameState;

    const { gameSetting, gameConfigs } = useGameContext();
    const gameName = gameSetting.gameName.toLowerCase();
    const { t } = useTranslation(gameSetting.gameName.toLowerCase());
    const { odds } = gameConfigs;

    console.log(JSON.stringify(settlementResult, null, 2))
    const firstBetAreaChoiceConfig =activeHalfTimeResult ? KenoMatchConfigs.choices.firstHalf : KenoMatchConfigs.choices.liveFullTime;
    return (
        <div>
            <div>
                <div>{firstBetAreaChoiceConfig.name}</div>
                <div className={Styles[`layout-${gameName}`]}>
                    {firstBetAreaChoiceConfig.config.map((choice, index) => {
                        const choiceName =  choicesMapper[choice.name],
                        isHighLight =
                            // kenoMatchGameState !== KenoMatchGameStateEnum.HalfTimeLockingBet &&
                            settlementResult[choiceName];

                            
                        //     console.log("choice.name: " + aa);
                        // console.log("isHighLight: " + isHighLight);

                        
                        return (
                            <div key={index} className={Styles[`choice-${choice.displayedName}`]}>
                                {renderBetOptionByChoice(
                                    choiceName,
                                    t(choice.displayedName),
                                    odds[choice.name],
                                    isHighLight,
                                    gameState,
                                    isShowWinningEffect
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
            <div>
                <div>{KenoMatchConfigs.choices.fullTime.name}</div>
                <div className={`${Styles[`layout-${gameName}`]} disabled`} >
                    {KenoMatchConfigs.choices.fullTime.config.map((choice, index) => {
                        const choiceName =  choicesMapper[choice.name],
                        isHighLight =
                            // kenoMatchGameState !== KenoMatchGameStateEnum.FullTimeLockingBet &&
                            settlementResult[choiceName];
                        return (
                            <div key={index} className={Styles[`choice-${choice.displayedName}`]}>
                                {renderBetOptionByChoice(
                                    choiceName,
                                    t(choice.displayedName),
                                    odds[choice.name],
                                    isHighLight,
                                    gameState,
                                    isShowWinningEffect
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default KenoMatchBetOptions;
