import { useTranslation } from "next-i18next";
import React from "react";
import { useGameContext } from "../../../../contexts/game-context/game-context";
import { Result, SettlementResult, CardOrder, Cards } from "../baccarat";
import Styles from "./baccarat-animations.module.scss";
import { ViewMode } from "../../../shared/game-base/type";
import Card from "../../../shared/card";

const generateResult = (cards: CardOrder[], viewMode: ViewMode) => {
    return cards.map((card, _) => {
        return (
            <div key={card.order} className={Styles[`card${card.order}`]}>
                <div className={Styles["rotate-card"]}>
                    <Card result={card.value} viewMode={viewMode}></Card>
                </div>
                <div className={`${Styles["card-back"]} ${viewMode === ViewMode.collapse && Styles["collapse-mode"]}`}></div>
            </div>
        );
    });
};

const generateDisplayScore = (cards: CardOrder[]) => {
    const validCards = cards.filter((c) => !!c.value);

    const point = validCards.reduce((total, c) => {
        return c.value.card + 1 >= 10 ? total : (total + c.value.card + 1) % 10;
    }, 0);

    return <div className={`${Styles[`group-${validCards.length}-cards`]} ${Styles["score"]}`}>{point}</div>;
};

export const BaccaratResult: React.FC<{ result?: Result }> = ({ result }) => {
    const { playResultAnimation, viewMode } = useGameContext();
    const playerCards = [
        { value: result.player.card3, order: 5 },
        { value: result.player.card2, order: 3 },
        { value: result.player.card1, order: 1 },
    ];

    const bankerCards = [
        { value: result.banker.card1, order: 2 },
        { value: result.banker.card2, order: 4 },
        { value: result.banker.card3, order: 6 },
    ];

    if (!result.player.card3) {
        bankerCards[2].order = 5;
    }

    return (
        <div className={`${Styles["open-cards"]} ${playResultAnimation ? Styles["has-animation"] : ""}`}>
            <div className="overlay-mask">
                <div
                    className={`${Styles["animation-container"]} ${Styles["player"]} ${
                        playResultAnimation ? "" : Styles["move-up-no-animation"]
                    }`}
                >
                    {generateResult(
                        playerCards.filter((c) => c.value),
                        viewMode
                    )}
                    {generateDisplayScore(playerCards)}
                </div>

                <div
                    className={`${Styles["animation-container"]} ${Styles["banker"]} ${
                        playResultAnimation ? "" : Styles["move-up-no-animation"]
                    }`}
                >
                    {generateResult(
                        bankerCards.filter((c) => c.value),
                        viewMode
                    )}
                    {generateDisplayScore(bankerCards)}
                </div>
            </div>
        </div>
    );
};

export const generateSettlementInfo = (settlementResult: SettlementResult, resources: Object, isCollapse: boolean = false) => {
    return (
        <div className={Styles[isCollapse ? "result-container" : "result-label"]}>
            {settlementResult.player ? (
                <div className={Styles["result-info-blue"]}>{resources["player"]}</div>
            ) : settlementResult.banker ? (
                <div className={Styles["result-info-red"]}>{resources["banker"]}</div>
            ) : (
                <div className={Styles["result-info-green"]}>{resources["tie"]}</div>
            )}
            {settlementResult.playerPair ? <div className={Styles["result-info-blue"]}>{resources["playerPair"]}</div> : <></>}
            {settlementResult.bankerPair ? <div className={Styles["result-info-red"]}>{resources["bankerPair"]}</div> : <></>}
            {settlementResult.big ? (
                <div className={Styles["result-info-blue"]}>{resources["big"]}</div>
            ) : (
                <div className={Styles["result-info-red"]}>{resources["small"]}</div>
            )}
        </div>
    );
};

export const BaccaratResultCollapse: React.FC<{ result: Result; settlementResult: SettlementResult }> = ({ result, settlementResult }) => {
    const { gameSetting, playResultAnimation, viewMode } = useGameContext();
    const { t } = useTranslation(gameSetting.gameName.toLowerCase());
    const playerCards = [
        { value: result.player.card1, order: 1 },
        { value: result.player.card2, order: 3 },
        { value: result.player.card3, order: 5 },
    ];

    const bankerCards = [
        { value: result.banker.card1, order: 2 },
        { value: result.banker.card2, order: 4 },
        { value: result.banker.card3, order: 6 },
    ];

    if (!result.player.card3) {
        bankerCards[2].order = 5;
    }

    const resources = {
        player: t("player"),
        banker: t("banker"),
        tie: t("tie"),
        playerPair: t("playerPair"),
        bankerPair: t("bankerPair"),
        big: t("big"),
        small: t("small"),
    };

    return (
        <div className={`${Styles["open-cards"]} ${Styles["result-collapse-mode"]} ${playResultAnimation ? Styles["has-animation"] : ""}`}>
            <div className={Styles["result-container"]}>
                <div
                    className={`${Styles["animation-container"]} ${Styles["player"]} ${playResultAnimation ? "" : "move-up-no-animation"}`}
                >
                    {generateResult(
                        playerCards.filter((c) => c.value),
                        viewMode
                    )}
                    {generateDisplayScore(playerCards)}
                </div>
                <div
                    className={`${Styles["animation-container"]}  ${Styles["banker"]} ${playResultAnimation ? "" : "move-up-no-animation"}`}
                >
                    {generateResult(
                        bankerCards.filter((c) => c.value),
                        viewMode
                    )}
                    {generateDisplayScore(bankerCards)}
                </div>
            </div>
            {!playResultAnimation && settlementResult && generateSettlementInfo(settlementResult, resources, true)}
        </div>
    );
};

export const DrawCardsAnimation = ({ playAnimation = false }) => {
    return (
        <div className={`${Styles["draw-cards"]} ${playAnimation ? Styles["has-animation"] : ""}`}>
            <div className={`${Styles["animation-container"]}  ${Styles["player"]}`}>
                <div className={Styles["card3"]}>
                    <div className={Styles["card-shadow"]}></div>
                    <div className={Styles["card-back"]}></div>
                </div>
                <div className={Styles["card1"]}>
                    <div className={Styles["card-shadow"]}></div>
                    <div className={Styles["card-back"]}></div>
                </div>
            </div>
            <div className={`${Styles["animation-container"]}  ${Styles["banker"]}`}>
                <div className={Styles["card2"]}>
                    <div className={Styles["card-shadow"]}></div>
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
