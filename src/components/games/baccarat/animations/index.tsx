import { useTranslation } from "next-i18next";
import React from "react";
import { useGameContext } from "../../../../contexts/game-context/game-context";
import { Result, SettlementResult, CardOrder, Cards } from "../baccarat";
import Styles from "./baccarat-animations.module.scss";
import { ViewMode } from "../../../shared/game-base/type";
import Card from "../../../shared/card";
import { GetPlayerCardsResult, GetBankerCardsResult } from "../baccarat-helper";

export const generateResult = (cards: CardOrder[], viewMode: ViewMode) => {
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

export const generateDisplayScore = (cards: CardOrder[]) => {
    const validCards = cards.filter((c) => !!c.value);

    const point = validCards.reduce((total, c) => {
        return c.value.card + 1 >= 10 ? total : (total + c.value.card + 1) % 10;
    }, 0);

    return <div className={`${Styles[`group-${validCards.length}-cards`]} ${Styles["score"]}`}>{point}</div>;
};

export const BaccaratResult: React.FC<{ result?: Result }> = ({ result }) => {
    const { playResultAnimation, viewMode } = useGameContext();
    return (
        <div className={`${Styles["open-cards"]} ${playResultAnimation ? Styles["has-animation"] : ""}`}>
            <div className="overlay-mask">
                <div
                    className={`${Styles["animation-container"]} ${Styles["player"]} ${
                        playResultAnimation ? "" : Styles["move-up-no-animation"]
                    }`}
                >
                    {generateResult(
                        GetPlayerCardsResult(result).filter((c) => c.value),
                        viewMode
                    )}
                    {generateDisplayScore(GetPlayerCardsResult(result))}
                </div>

                <div
                    className={`${Styles["animation-container"]} ${Styles["banker"]} ${
                        playResultAnimation ? "" : Styles["move-up-no-animation"]
                    }`}
                >
                    {generateResult(
                        GetBankerCardsResult(result).filter((c) => c.value),
                        viewMode
                    )}
                    {generateDisplayScore(GetBankerCardsResult(result))}
                </div>
            </div>
        </div>
    );
};

export const BaccaratResultCollapse: React.FC<{ result: Result; settlementResult: SettlementResult }> = ({ result, settlementResult }) => {
    const { gameSetting, playResultAnimation, viewMode } = useGameContext();
    const { t } = useTranslation(gameSetting.gameName.toLowerCase());

    return (
        <div className={`${Styles["open-cards"]} ${Styles["result-collapse-mode"]} ${playResultAnimation ? Styles["has-animation"] : ""}`}>
            <div className={Styles["result-container"]}>
                <div
                    className={`${Styles["animation-container"]} ${Styles["player"]} ${playResultAnimation ? "" : "move-up-no-animation"}`}
                >
                    {generateResult(
                        GetPlayerCardsResult(result).filter((c) => c.value),
                        viewMode
                    )}
                    {generateDisplayScore(GetPlayerCardsResult(result))}
                </div>
                <div
                    className={`${Styles["animation-container"]}  ${Styles["banker"]} ${playResultAnimation ? "" : "move-up-no-animation"}`}
                >
                    {generateResult(
                        GetBankerCardsResult(result).filter((c) => c.value),
                        viewMode
                    )}
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

export const generateSettlementInfo = (settlementResult: SettlementResult, resources: Object) => {
    const resultCount = 2 + (settlementResult.playerPair ? 1 : 0) + (settlementResult.bankerPair ? 1 : 0);

    return (
        <div className={`${Styles["result-container"]} ${Styles[`result-${resultCount}`]}`}>
            {settlementResult.player ? (
                <div className={Styles["result-info-blue"]}>{resources["player"]}</div>
            ) : settlementResult.banker ? (
                <div className={Styles["result-info-red"]}>{resources["banker"]}</div>
            ) : (
                <div className={Styles["result-info-green"]}>{resources["tie"]}</div>
            )}
            {settlementResult.big ? (
                <div className={Styles["result-info-blue"]}>{resources["big"]}</div>
            ) : (
                <div className={Styles["result-info-red"]}>{resources["small"]}</div>
            )}
            {settlementResult.playerPair ? (
                <div className={`${Styles["result-info-blue"]} ${Styles["result-player-pair"]}`}>{resources["playerPair"]}</div>
            ) : (
                <></>
            )}
            {settlementResult.bankerPair ? (
                <div className={`${Styles["result-info-red"]} ${Styles["result-banker-pair"]}`}>{resources["bankerPair"]}</div>
            ) : (
                <></>
            )}
        </div>
    );
};
