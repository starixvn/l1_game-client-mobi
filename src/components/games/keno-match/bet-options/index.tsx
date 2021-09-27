import { useTranslation } from "next-i18next";
import React from "react";

import { useGameContext } from "../../../../contexts/game-context/game-context";
import { GameState } from "../../../shared/game-base/type";
import KenoMatchBetOption from "../bet-option";
import { choicesMapper, KenoMatchConfigs } from "../keno-match-helper";
import { SettlementResult } from "../type";
import Styles from "./bet-options.module.scss";

interface KenoMatchBetOptionsProps {
    settlementResult: SettlementResult;
    gameState: GameState;
    isShowWinningEffect: boolean;
    isFirstHalf: boolean;
    liveOdds: any;
}

const KenoMatchBetOptions: React.FunctionComponent<KenoMatchBetOptionsProps> = ({
    liveOdds,
    gameState,
    settlementResult,
    isShowWinningEffect,
    isFirstHalf,
}) => {
    const { gameSetting, gameConfigs } = useGameContext();
    const gameName = gameSetting.gameName.toLowerCase();
    const { t } = useTranslation(gameSetting.gameName.toLowerCase());
    const { odds } = gameConfigs;

    const halfMatchConfigs = [
        {
            isActive: !isFirstHalf ? liveOdds !== null : true,
            values: isFirstHalf ? KenoMatchConfigs.choices.firstHalf : KenoMatchConfigs.choices.liveFullTime,
        },
        {
            isActive: isFirstHalf,
            values: KenoMatchConfigs.choices.fullTime,
        },
    ];

    const getOddsByChoice = (choiceName: string) => liveOdds?.[choiceName] ?? odds[choiceName];

    return (
        <>
            {halfMatchConfigs.map((halfMatchConfig, parentIndex) => {
                return (
                    <div key={parentIndex}>
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
                                    isHighlight = settlementResult[choiceName];

                                const betOptionProps = {
                                    choice: choice.name,
                                    odd: getOddsByChoice(choice.name),
                                    isDisplayOdd: true,
                                    isHighlight,
                                    gameState,
                                    isShowWinningEffect,
                                    bettypeName: choice.bettypeName,
                                };

                                return choice.name.toLowerCase() === "total" ? (
                                    <div key={index} className={Styles["total-row"]}>
                                        {t("total")}
                                    </div>
                                ) : (
                                    <div key={index} className={Styles[`choice-${choice.displayedName}`]}>
                                        <KenoMatchBetOption key={index} {...betOptionProps}>
                                            <div className={`${Styles["bet-choice-name"]} ${Styles[choiceName]}`}>
                                                {t(choice.displayedName)}
                                            </div>
                                        </KenoMatchBetOption>
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
