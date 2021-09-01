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
    isActiveLiveFullTime: boolean;
    liveOdds: any;
}

const TotalCell = () =>  <div className={Styles["total-row"]}>Total</div>;

const KenoMatchBetOptions: React.FunctionComponent<Props> = (props) => {
    const { gameState, settlementResult, isShowWinningEffect, isActiveLiveFullTime } = props;
    const kenoMatchGameState = gameState as KenoMatchGameState;
    const { gameSetting, gameConfigs } = useGameContext();
    const gameName = gameSetting.gameName.toLowerCase();
    const { t } = useTranslation(gameSetting.gameName.toLowerCase());
    const { odds } = gameConfigs;

    const halfMatchConfigs = [
        {
            isActive: isActiveLiveFullTime ? (props.liveOdds !== null) : true,
            config: isActiveLiveFullTime ? KenoMatchConfigs.choices.liveFullTime : KenoMatchConfigs.choices.firstHalf,
        },
        {
            isActive: !isActiveLiveFullTime,
            config: KenoMatchConfigs.choices.fullTime,
        }
    ];

    function getOddsByChoice(choiceName: string) {
        return props.liveOdds?.[choiceName] ?? odds[choiceName];
    }

    return (
        <> 
            {halfMatchConfigs.map((halfMatchConfig, parentIndex) => {
                return (
                    <div key={parentIndex}>
                        <div className={Styles["title-wrapper"]}>
                            <div className={Styles["title-left"]}>{halfMatchConfig.config.name}</div>
                           { halfMatchConfig.isActive && <div className={Styles["title-right"]}>Mời cược</div>}
                        </div>
                        <div className={`${Styles[`layout-${gameName}`]} ${halfMatchConfig.isActive ? "" : Styles["disabled"]}`}>
                            {halfMatchConfig.config.config.map((choice, index) => {
                                const choiceName = choicesMapper[choice.name],
                                isHighlight = settlementResult[choiceName] ;
                                        //  && kenoMatchGameState !== KenoMatchGameStateEnum.HalfTimeLockingBet ;

                                const betOptionProps = {
                                    choice:choice.name,
                                    odd: getOddsByChoice(choice.name),
                                    isDisplayOdd:true,
                                    isHighlight,
                                    gameState,
                                    isShowWinningEffect
                                };

                                // if(isActiveFullTime){
                                // console.log(JSON.stringify(betOptionProps, null, 2));
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
