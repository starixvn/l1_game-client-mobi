import { useTranslation } from "next-i18next";
import React from "react";
import { useGameContext } from "../../../../contexts/game-context/game-context";
import { Result, SettlementResult, CardOrder } from "../baccarat";
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
                    className={`${Styles["animation-container"]} ${Styles["player"]} ${playResultAnimation ? "" : Styles["move-up-no-animation"]}`}
                >
                    {generateResult(
                        playerCards.filter((c) => c.value),
                        viewMode
                    )}
                </div>
                <div
                    className={`${Styles["animation-container"]} ${Styles["banker"]} ${playResultAnimation ? "" : Styles["move-up-no-animation"]}`}
                >
                    {generateResult(
                        bankerCards.filter((c) => c.value),
                        viewMode
                    )}
                </div>
            </div>
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
                </div>
                <div
                    className={`${Styles["animation-container"]}  ${Styles["banker"]} ${playResultAnimation ? "" : "move-up-no-animation"}`}
                >
                    {generateResult(
                        bankerCards.filter((c) => c.value),
                        viewMode
                    )}
                </div>
            </div>
            {!playResultAnimation && settlementResult && (
                <div className={Styles["result-label"]}>
                    {settlementResult?.tie ? t("tie") : settlementResult?.banker ? t("bankerWin") : t("playerWin")}
                </div>
            )}
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
