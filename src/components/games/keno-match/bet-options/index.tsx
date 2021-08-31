import { useTranslation } from "next-i18next";
import React from "react";

import { useGameContext } from "../../../../contexts/game-context/game-context";
import BetOption from "../../../shared/bet-option";
import { GameState } from "../../../shared/game-base/type";
import { SettlementResult, KenoMatchGameStateEnum, KenoMatchGameState } from "../type";
import { KenoMatchConfigs } from "../keno-match-helper";
import Styles from "./bet-options.module.scss";
import { choicesMapper } from "../keno-match-helper";

interface Props {
    settlementResult: SettlementResult;
    gameState: GameState;
    isShowWinningEffect: boolean;
    activeHalfTimeResult: boolean;
}

const KenoMatchBetOptions: React.FunctionComponent<Props> = (props) => {
    const { gameState, settlementResult, isShowWinningEffect, activeHalfTimeResult } = props;
    const { gameSetting, gameConfigs } = useGameContext();
    const gameName = gameSetting.gameName.toLowerCase();
    const { t } = useTranslation(gameSetting.gameName.toLowerCase());
    const { odds } = gameConfigs;

    // console.log(JSON.stringify(settlementResult, null, 2));
    const configs = [
        activeHalfTimeResult ? KenoMatchConfigs.choices.firstHalf : KenoMatchConfigs.choices.liveFullTime,
        KenoMatchConfigs.choices.fullTime,
    ];

    return (
        <>
            {configs.map((halfMatchConfig, parentIndex) => {
                return (
                    <div key={parentIndex}>
                        <div>{halfMatchConfig.name}</div>
                        <div className={Styles[`layout-${gameName}`]}>
                            {halfMatchConfig.config.map((choice, index) => {
                                const choiceName = choicesMapper[choice.name],
                                    isHighLight =
                                        // kenoMatchGameState !== KenoMatchGameStateEnum.HalfTimeLockingBet &&
                                        settlementResult[choiceName];
                                //     console.log("choice.name: " + aa);
                                // console.log("isHighLight: " + isHighLight);

                                return choice.name.toLowerCase() === "total" ?
                                    <div className={Styles["total-row"]}>Total</div>
                                    :  <div key={index} className={Styles[`choice-${choice.displayedName}`]}>
                                        <BetOption
                                            choice={choiceName}
                                            odd={odds[choice.name]}
                                            isDisplayOdd={true}
                                            isHighlight={isHighLight}
                                            gameState={gameState}
                                            isShowWinningEffect={isShowWinningEffect}
                                        >
                                            <div className={`${Styles["bet-choice-name"]} ${Styles[choiceName]}`}>
                                                {t(choice.displayedName)}
                                            </div>
                                        </BetOption>
                                    </div>
                                ;
                            })}
                        </div>
                    </div>
                );
            })}
        </>
    );
};

export default KenoMatchBetOptions;
