import { useTranslation } from "next-i18next";
import React from "react";
import { useGameContext } from "../../../../contexts/game-context/game-context";
import { Result, SettlementResult } from "../three-cards";
import Styles from "./three-cards-animations.module.scss";
import { ViewMode } from "../../../shared/game-base/type";
import Card, { convertCardRankToIndex } from "../../../shared/card";

export const DrawCardsAnimation = ({ playAnimation = false }) => {
    return (
        <div className={`${Styles["draw-cards"]} ${playAnimation ? Styles["has-animation"] : ""}`}>
            <div className={`${Styles["animation-container"]}`}>
                <div className={Styles["card1"]}>
                    <div className={Styles["card-shadow"]}></div>
                    <div className={Styles["card-back"]}></div>
                </div>
                <div className={Styles["card2"]}>
                    <div className={Styles["card-shadow"]}></div>
                    <div className={Styles["card-back"]}></div>
                </div>
                <div className={Styles["card3"]}>
                    <div className={Styles["card-shadow"]}></div>
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

    return (
        <div className={`${Styles["open-cards"]} ${playResultAnimation ? Styles["has-animation"] : ""}`}>
            <div className="overlay-mask">
                <div className={`${Styles["animation-container"]} ${playResultAnimation ? "" : "move-up-no-animation"}`}>
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
    const suits = ["heart", "diamond", "club", "spade"];

    return (
        <div className={`${Styles["open-cards"]} ${Styles["result-collapse-mode"]} ${playResultAnimation ? Styles["has-animation"] : ""}`}>
            <div className={Styles["result-container"]}>
                <div className={`${Styles["animation-container"]} ${playResultAnimation ? "" : "move-up-no-animation"}`}>
                    {generateResult(result, viewMode)}
                </div>
            </div>
            {!playResultAnimation && settlementResult && (
                <div className={Styles["result-label"]}>{t(settlementResult.red ? "red" : "black")}</div>
            )}
        </div>
    );
};
