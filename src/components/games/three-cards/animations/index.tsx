import { useTranslation } from "next-i18next";
import React from "react";
import { useGameContext } from "../../../../contexts/game-context/game-context";
import { Result, SettlementResult } from "../three-cards";
import Styles from "./three-cards-animations.module.scss";
import { ViewMode } from "../../../shared/game-base/type";
import Card, { convertCardRankToIndex } from "../../../shared/card";

const classHasAnimation = "has-animation";
const classAnimationContainer = "animation-container";

export const DrawCardsAnimation = ({ playAnimation = false }) => {
    const classCardShadow = "card-shadow";
    return (
        <div className={`${Styles["draw-cards"]} ${playAnimation ? Styles[classHasAnimation] : ""}`}>
            <div className={`${Styles[classAnimationContainer]}`}>
                <div className={Styles["card1"]}>
                    <div className={Styles[classCardShadow]}></div>
                    <div className={Styles["card-back"]}></div>
                </div>
                <div className={Styles["card2"]}>
                    <div className={Styles[classCardShadow]}></div>
                    <div className={Styles["card-back"]}></div>
                </div>
                <div className={Styles["card3"]}>
                    <div className={Styles[classCardShadow]}></div>
                    <div className={Styles["card-back"]}></div>
                </div>
            </div>
        </div>
    );
};

const generateResult = (cards: Result, viewMode: ViewMode) => {
    return cards.map((card, index) => {
        const cardType = { card: convertCardRankToIndex(card.rank) - 1, type: card.suit };

        return (
            <div key={index} className={Styles[`card${index + 1}`]}>
                <div className={Styles["rotate-card"]}>
                    <Card result={cardType} viewMode={viewMode}></Card>
                </div>
                <div className={`${Styles["card-back"]} ${viewMode === ViewMode.collapse && Styles["collapse-mode"]}`}></div>
            </div>
        );
    });
};

export const ThreeCardsResult: React.FC<{ result?: Result }> = ({ result }) => {
    const { viewMode, playResultAnimation } = useGameContext();
    const delay3rdCard = (result[0].suit <= 1 && result[1].suit >= 2) || (result[0].suit >= 2 && result[1].suit <= 1);

    return (
        <div
            className={`${Styles["normal-mode"]} ${Styles["open-cards"]} ${playResultAnimation && Styles[classHasAnimation]}
        ${delay3rdCard ? Styles["delay-3rd-card"] : ""}`}
        >
            <div className="overlay-mask">
                <div className={`${Styles[classAnimationContainer]} ${playResultAnimation ? "" : Styles["move-up-no-animation"]}`}>
                    {generateResult(result, viewMode)}
                </div>
            </div>
        </div>
    );
};

const isRedSuit = (suit: number) => {
    return suit === 0 || suit === 1;
};

export const ThreeCardsResultCollapse: React.FC<{ result: Result; settlementResult: SettlementResult }> = ({
    result,
    settlementResult,
}) => {
    const { gameSetting, playResultAnimation, viewMode } = useGameContext();
    const { t } = useTranslation(gameSetting.gameName.toLowerCase());
    return (
        <div className={`${Styles["open-cards"]} ${Styles["result-collapse-mode"]} ${playResultAnimation && Styles[classHasAnimation]}`}>
            <div className={Styles["result-container"]}>{generateResult(result, viewMode)}</div>
            {!playResultAnimation && settlementResult && (
                <div className={Styles["result-label"]}>{t(settlementResult.red ? "red" : "black")}</div>
            )}
        </div>
    );
};
