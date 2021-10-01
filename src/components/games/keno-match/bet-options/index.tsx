import { useTranslation } from "next-i18next";
import React from "react";

import { useGameContext } from "../../../../contexts/game-context/game-context";
import { GameState } from "../../../shared/game-base/type";
import { SettlementResult } from "../type";
import Styles from "./bet-options.module.scss";
import BetOption from "../../../shared/bet-option";
import { choicesMapper, KenoMatchConfigs } from "./choice-config";

interface KenoMatchBetOptionsProps {
    settlementResult: SettlementResult;
    gameState: GameState;
    isShowWinningEffect: boolean;
    isFirstHalf: boolean;
    liveOdds: any;
    beforeStartFulltime: boolean;
}

const KenoMatchBetOptions: React.FunctionComponent<KenoMatchBetOptionsProps> = ({
    liveOdds,
    gameState,
    settlementResult,
    isShowWinningEffect,
    isFirstHalf,
    beforeStartFulltime
}) => {
    const { gameSetting, gameConfigs } = useGameContext();
    const gameName = gameSetting.gameName.toLowerCase();
    const { t } = useTranslation(gameSetting.gameName.toLowerCase());
    const { odds } = gameConfigs;

    const halfMatchConfigs = [
        {
            isActive: !isFirstHalf ? liveOdds !== null : true,
            values: isFirstHalf ? KenoMatchConfigs[0] :  KenoMatchConfigs[2] ,
        },
        {
            isActive: isFirstHalf,
            values: KenoMatchConfigs[1],
        },
    ];

    const getOddsByChoice = (choiceName: string) => liveOdds?.[choiceName] ?? odds[choiceName];

    return (
        <>
            {halfMatchConfigs.map((halfMatchConfig, parentIndex) => {
                const isFTLive = parentIndex === 0 && !isFirstHalf;
                const ftLiveClass =  isFTLive? "live-bet-option" : "";

                return (
                    <div key={parentIndex} className={`${Styles[ftLiveClass]} ${beforeStartFulltime? Styles["has-animation"] : ""}`}>
                        <div className={Styles["title-wrapper"]}>
                            <div className={Styles["title-left"]}>{t(`${halfMatchConfig.values.name}`)}</div>
                            {halfMatchConfig.isActive && (
                                <div className={Styles["title-right"]}>
                                    <span>{t("betInvite")}</span>
                                    {!isFirstHalf && <img src={`/static/images/live_icon.svg`} className={Styles["live-icon"]} />}
                                </div>
                            )}
                        </div>
                        <div className={`${Styles[`layout-${gameName}`]} ${halfMatchConfig.isActive ? "" : Styles["disabled"]}`}>
                            {halfMatchConfig.values.config.map((choice, index) => {
                                const choiceName = choicesMapper[choice.name],
                                isHighlight = gameState !== GameState.LockingBet && settlementResult[choiceName];

                                const odd = getOddsByChoice(choice.name);

                                const betOptionProps = {
                                    choice: choice.name,
                                    odd,
                                    isDisplayOdd: true,
                                    isHighlight,
                                    gameState,
                                    isShowWinningEffect,
                                    isShowBettype: true,
                                    bettypeName: choice.bettypeName,
                                    isShowPoolStake: false,
                                    isShowTooltip: choice.isShowTooltip,
                                    tooltipMessage: choice.tooltipMessage
                                };

                                return choice.name.toLowerCase() === "total" ? (
                                    <div key={index} className={Styles["total-row"]}>
                                        {t("sum")}
                                    </div>
                                ) : (
                                    <div key={index} className={`${Styles[`choice-${choice.displayedName}`]} ${odd !== undefined ? "" : Styles["disabled"]}`}>
                                        <BetOption key={index} {...betOptionProps}>
                                            <div className={`${Styles["bet-choice-name"]} ${Styles[choiceName]}`}>
                                                {t(choice.displayedName)}
                                            </div>
                                        </BetOption>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </>
    );
};

export default KenoMatchBetOptions;
