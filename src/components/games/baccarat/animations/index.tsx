import React from "react";
import { useTranslation } from "next-i18next";

import { useGameContext } from "../../../../contexts/game-context/game-context";
import { Result, SettlementResult, CardOrder } from "../baccarat";
import { ViewMode } from "../../../shared/game-base/type";
import Card from "../../../shared/card";
import { GetPlayerCardsResult, GetBankerCardsResult } from "../baccarat-helper";
import Styles from "./baccarat-animations.module.scss";

const classAnimation = "has-animation";
const classAnimationContainer = "animation-container";
const classMoveUpNoAnimation = "move-up-no-animation";

export const generateResult = (cards: CardOrder[], viewMode: ViewMode) => {
    return cards.map((card, _) => {
        const classCardOrder = `card${card.order}`;
        return (
            <div key={card.order} className={`${Styles[classCardOrder]}`}>
                <div className={Styles["rotate-card"]}>
                    <Card result={card.value} viewMode={viewMode}></Card>
                </div>
                <div className={`${Styles["card-back"]} ${viewMode === ViewMode.collapse && Styles["collapse-mode"]}`}></div>
            </div>
        );
    });
};

export const generateDisplayScore = (cards: CardOrder[]) => {
    const classGroupCards = `group-${cards.length}-cards`;
    const point = cards.reduce((total, c) => {
        return c.value.card + 1 >= 10 ? total : (total + c.value.card + 1) % 10;
    }, 0);

    return <div className={`${Styles[classGroupCards]} ${Styles["score"]}`}>{point}</div>;
};

export const BaccaratResult: React.FC<{ result?: Result }> = ({ result }) => {
    const { playResultAnimation, viewMode } = useGameContext();
    const resultCount = 4 + (!!result.player.card3 ? 1 : 0) + (!!result.banker.card3 ? 1 : 0);
    const classCardCount = `card-${resultCount}`;

    return (
        <div className={`${Styles["open-cards"]} ${Styles[classCardCount]}  ${playResultAnimation ? Styles[classAnimation] : ""}`}>
            <div className="overlay-mask">
                <div
                    className={`${Styles[classAnimationContainer]} ${Styles["player"]} ${
                        playResultAnimation ? "" : Styles[classMoveUpNoAnimation]
                    }`}
                >
                    {generateResult(GetPlayerCardsResult(result), viewMode)}
                    {generateDisplayScore(GetPlayerCardsResult(result))}
                    <div className={Styles["test"]}></div>
                </div>

                <div
                    className={`${Styles[classAnimationContainer]} ${Styles["banker"]} ${
                        playResultAnimation ? "" : Styles[classMoveUpNoAnimation]
                    }`}
                >
                    {generateResult(GetBankerCardsResult(result), viewMode)}
                    {generateDisplayScore(GetBankerCardsResult(result))}
                </div>
            </div>
        </div>
    );
};

export const BaccaratResultCollapse: React.FC<{ result: Result; settlementResult: SettlementResult }> = ({ result, settlementResult }) => {
    const { gameSetting, playResultAnimation, viewMode } = useGameContext();
    const { t } = useTranslation(gameSetting.gameName.toLowerCase());
    const resultCount = 4 + (!!result.player.card3 ? 1 : 0) + (!!result.banker.card3 ? 1 : 0);
    const classCardCount = `card-${resultCount}`;

    return (
        <div
            className={`${Styles["open-cards"]}  ${Styles[classCardCount]} ${Styles["result-collapse-mode"]} ${
                playResultAnimation ? Styles[classAnimation] : ""
            }`}
        >
            <div className={Styles["result-wrapper"]}>
                <div
                    className={`${Styles[classAnimationContainer]} ${Styles["player"]} ${
                        playResultAnimation ? "" : classMoveUpNoAnimation
                    }`}
                >
                    {generateResult(GetPlayerCardsResult(result), viewMode)}
                    {generateDisplayScore(GetPlayerCardsResult(result))}
                </div>
                <div
                    className={`${Styles[classAnimationContainer]}  ${Styles["banker"]} ${
                        playResultAnimation ? "" : classMoveUpNoAnimation
                    }`}
                >
                    {generateResult(GetBankerCardsResult(result), viewMode)}
                    {generateDisplayScore(GetBankerCardsResult(result))}
                </div>
            </div>
            {!playResultAnimation && settlementResult && (
                <div className={Styles["result-label"]}>
                    {settlementResult.player ? t("player") : settlementResult.banker ? t("banker") : t("tie")}
                </div>
            )}
        </div>
    );
};

export const DrawCardsAnimation = ({ playAnimation = false }) => {
    const classCardShadow = "card-shadow";
    return (
        <div className={`${Styles["draw-cards"]} ${playAnimation ? Styles[classAnimation] : ""}`}>
            <div className={`${Styles[classAnimationContainer]}  ${Styles["player"]}`}>
                <div className={Styles["card1"]}>
                    <div className={Styles[classCardShadow]}></div>
                    <div className={Styles["card-back"]}></div>
                </div>
                <div className={Styles["card3"]}>
                    <div className={Styles[classCardShadow]}></div>
                    <div className={Styles["card-back"]}></div>
                </div>
            </div>
            <div className={`${Styles[classAnimationContainer]}  ${Styles["banker"]}`}>
                <div className={Styles["card2"]}>
                    <div className={Styles[classCardShadow]}></div>
                    <div className={Styles["card-back"]}></div>
                </div>
                <div className={Styles["card4"]}>
                    <div className={Styles["card-shadow"]}></div>
                    <div className={Styles["card-back"]}></div>
                </div>
            </div>
        </div>
    );
};

export const generateSettlementInfo = (settlementResult: SettlementResult, resources: Object, isShowTicketHistory = false) => {
    const resultCount = 2 + (settlementResult.playerPair ? 1 : 0) + (settlementResult.bankerPair ? 1 : 0);
    const classResultInfoBlue = "result-info-blue";
    const classResultInfoRed = "result-info-red";
    const classResultCount = `result-${resultCount}`;
    return (
        <div className={`${Styles["result-container"]} ${Styles[classResultCount]} ${isShowTicketHistory && Styles["ticket-history"]}`}>
            {settlementResult.player ? (
                <div className={Styles[classResultInfoBlue]}>{resources["player"]}</div>
            ) : settlementResult.banker ? (
                <div className={Styles[classResultInfoRed]}>{resources["banker"]}</div>
            ) : (
                <div className={Styles["result-info-green"]}>{resources["tie"]}</div>
            )}
            {settlementResult.big ? (
                <div className={Styles[classResultInfoBlue]}>{resources["big"]}</div>
            ) : (
                <div className={Styles[classResultInfoRed]}>{resources["small"]}</div>
            )}
            {settlementResult.playerPair ? (
                <div className={`${Styles[classResultInfoBlue]} ${Styles["result-player-pair"]}`}>{resources["playerPair"]}</div>
            ) : (
                <></>
            )}
            {settlementResult.bankerPair ? (
                <div className={`${Styles[classResultInfoRed]} ${Styles["result-banker-pair"]}`}>{resources["bankerPair"]}</div>
            ) : (
                <></>
            )}
        </div>
    );
};
