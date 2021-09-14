import { useTranslation } from "next-i18next";
import React from "react";
import { useGameContext } from "../../../../contexts/game-context/game-context";
import { GameState } from "../../../shared/game-base/type";
import { SettlementResult } from "../type";
import { KenoMatchConfigs } from "../keno-match-helper";
import Styles from "./bet-options.module.scss";
import { choicesMapper } from "../keno-match-helper";
import KenoMatchBetOption from "../bet-option";

interface KenoMatchBetOptionsProps {
    settlementResult: SettlementResult;
    gameState: GameState;
    isShowWinningEffect: boolean;
    isActiveLiveFullTime: boolean;
    liveOdds: any;
}

const KenoMatchBetOptions: React.FunctionComponent<KenoMatchBetOptionsProps> = ({
    liveOdds,
    gameState,
    settlementResult,
    isShowWinningEffect,
    isActiveLiveFullTime,
}) => {
    const { gameSetting, gameConfigs } = useGameContext();
    const gameName = gameSetting.gameName.toLowerCase();
    const { t } = useTranslation(gameSetting.gameName.toLowerCase());
    const { odds } = gameConfigs;

    const halfMatchConfigs = [
        {
            isActive: isActiveLiveFullTime ? liveOdds !== null : true,
            config: isActiveLiveFullTime ? KenoMatchConfigs.choices.liveFullTime : KenoMatchConfigs.choices.firstHalf,
        },
        {
            isActive: !isActiveLiveFullTime,
            config: KenoMatchConfigs.choices.fullTime,
        },
    ];

    const getOddsByChoice = (choiceName: string) => liveOdds?.[choiceName] ?? odds[choiceName];

    return (
        <>
            {halfMatchConfigs.map((halfMatchConfig, parentIndex) => {
                return (
                    <div key={parentIndex}>
                        <div className={Styles["title-wrapper"]}>
                            <div className={Styles["title-left"]}>{t(`${halfMatchConfig.config.name}`)}</div>
                            {halfMatchConfig.isActive && <div className={Styles["title-right"]}>{t("betInvite")}</div>}
                        </div>
                        <div className={`${Styles[`layout-${gameName}`]} ${halfMatchConfig.isActive ? "" : Styles["disabled"]}`}>
                            {halfMatchConfig.config.config.map((choice, index) => {
                                const choiceName = choicesMapper[choice.name],
                                    isHighlight = settlementResult[choiceName];

                                const betOptionProps = {
                                    choice: choice.name,
                                    odd: getOddsByChoice(choice.name),
                                    isDisplayOdd: true,
                                    isHighlight,
                                    gameState,
                                    isShowWinningEffect,
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
