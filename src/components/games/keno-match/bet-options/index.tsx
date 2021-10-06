import { useTranslation } from "next-i18next";
import React from "react";

import { useGameContext } from "../../../../contexts/game-context/game-context";
import { GameState } from "../../../shared/game-base/type";
import { SettlementResult, Result } from "../type";
import { calculateTotalPoint } from "../../../keno/keno.helper";
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
    halfTimeResultInline?: Result;
}

const choiceOverUnderLive = ["liveFTOver", "liveFTUnder"];
const KenoMatchBetOptions: React.FunctionComponent<KenoMatchBetOptionsProps> = ({
    liveOdds,
    gameState,
    settlementResult,
    isShowWinningEffect,
    isFirstHalf,
    beforeStartFulltime,
    halfTimeResultInline,
}) => {
    const { gameSetting, gameConfigs } = useGameContext();
    const gameName = gameSetting.gameName.toLowerCase();
    const { t } = useTranslation(gameSetting.gameName.toLowerCase());
    const { odds } = gameConfigs;
    const totalPointFT = isFirstHalf ? 0 : calculateTotalPoint(halfTimeResultInline?.blue) + calculateTotalPoint(halfTimeResultInline?.red);
    const halfMatchConfigs = [
        {
            isActive: !isFirstHalf ? liveOdds !== null : true,
            values: isFirstHalf ? KenoMatchConfigs[0] : KenoMatchConfigs[2],
        },
        {
            isActive: isFirstHalf,
            values: KenoMatchConfigs[1],
        },
    ];

    const getOddsByChoice = (choiceName: string) => liveOdds?.[choiceName] ?? odds[choiceName];
    const isOfferOverUnderLive = (total: number) => {
        return total >= 661 && total <= 980;
    };
    const checkOfferChoice = ({ odd, choice }) => {
        if (odd === undefined || (choiceOverUnderLive.includes(choice) && !isOfferOverUnderLive(totalPointFT))) {
            return false;
        }
        return true;
    };

    return (
        <>
            {halfMatchConfigs.map((halfMatchConfig, parentIndex) => {
                const isFTLive = parentIndex === 0 && !isFirstHalf;
                const ftLiveClass = isFTLive ? "live-bet-option" : "";
                const hasAnimationClass = isFTLive && beforeStartFulltime ? Styles["has-animation"] : "";

                return (
                    <div key={parentIndex} className={`${Styles[ftLiveClass]} ${hasAnimationClass}`}>
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
                                const isOfferChoice = checkOfferChoice({ odd, choice: choice.name });

                                const betOptionProps = {
                                    choice: choice.name,
                                    odd,
                                    isDisplayOdd: true,
                                    isHighlight,
                                    gameState,
                                    isShowWinningEffect,
                                    isShowPoolStake: false,
                                    isShowTooltip: choice.isShowTooltip,
                                    tooltipMessage: choice.tooltipMessage,
                                };

                                return choice.name.toLowerCase() === "total" ? (
                                    <div key={index} className={Styles["total-row"]}>
                                        {t("sum")}
                                    </div>
                                ) : (
                                    <div
                                        key={index}
                                        className={`${Styles[`choice-${choice.displayedName}`]} ${isOfferChoice ? "" : Styles["disabled"]}`}
                                    >
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
