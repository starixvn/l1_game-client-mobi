import { useTranslation } from "next-i18next";
import React from "react";

import { useGameContext } from "../../../../contexts/game-context/game-context";
import { GameState } from "../../../shared/game-base/type";
import { SettlementResult, KenoMatchGameStateEnum, KenoMatchGameState } from "../type";
import { KenoMatchConfigs } from "../keno-match-helper";
import Styles from "./bet-options.module.scss";
import { choicesMapper } from "../keno-match-helper";

import KenoMatchBetOption from "../bet-option";

interface Props {
    settlementResult: SettlementResult;
    gameState: GameState;
    isShowWinningEffect: boolean;
    isActiveFullTime: boolean;
}

const TotalCell = () =>  <div className={Styles["total-row"]}>Total</div>;

const KenoMatchBetOptions: React.FunctionComponent<Props> = (props) => {
    const { gameState, settlementResult, isShowWinningEffect, isActiveFullTime } = props;
    const kenoMatchGameState = gameState as KenoMatchGameState;
    const { gameSetting, gameConfigs } = useGameContext();
    const gameName = gameSetting.gameName.toLowerCase();
    const { t } = useTranslation(gameSetting.gameName.toLowerCase());
    const { odds } = gameConfigs;

    
    // console.log(`-----------------------------------------`);
    // console.log(`isActiveFullTime: ${isActiveFullTime}`);
    //  console.log(JSON.stringify(settlementResult, null, 2));
    const configs = [
        isActiveFullTime ? KenoMatchConfigs.choices.liveFullTime : KenoMatchConfigs.choices.firstHalf,
        KenoMatchConfigs.choices.fullTime,
    ];

    // if(!isActiveFullTime)
    // {
    //     console.log(JSON.stringify(settlementResult, null, 2));
    // }

    return (
        <>
            {configs.map((halfMatchConfig, parentIndex) => {
                return (
                    <div key={parentIndex}>
                        <div className={Styles["title-wrapper"]}>
                            <div className={Styles["title-left"]}>{halfMatchConfig.name}</div>
                            <div className={Styles["title-right"]}>Mời cược</div>
                        </div>
                        <div className={Styles[`layout-${gameName}`]}>
                            {halfMatchConfig.config.map((choice, index) => {
                                const choiceName = choicesMapper[choice.name],
                                isHighlight = settlementResult[choiceName] ;
                                        //  && kenoMatchGameState !== KenoMatchGameStateEnum.HalfTimeLockingBet ;

                                const betOptionProps = {
                                    choice:choiceName,
                                    odd:odds[choice.name],
                                    isDisplayOdd:true,
                                    isHighlight,
                                    gameState,
                                    isShowWinningEffect
                                };

                                // if(!isActiveFullTime){
                                //     console.log(`${choiceName}: ${isHighlight}`);
                                // }
                              
                                return choice.name.toLowerCase() === "total" ?
                                        <TotalCell/>
                                    :  <div key={index} className={Styles[`choice-${choice.displayedName}`]}>
                                        <KenoMatchBetOption key={index}  {...betOptionProps} >
                                            <div className={`${Styles["bet-choice-name"]} ${Styles[choiceName]}`}>
                                                {t(choice.displayedName)}
                                            </div>
                                        </KenoMatchBetOption>
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
