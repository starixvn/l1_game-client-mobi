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

const sumScore = (score: number, card: number) => {
    return card + 1 >= 10 ? score : (score + card + 1) % 10;
};

class PlayerBankerResultComponent extends React.PureComponent<
    {
        playResultAnimation: boolean;
        result?: Result;
        viewMode: ViewMode;
        texts: any;
    },
    {
        playResultAnimation: boolean;
        result?: Result;
        viewMode: ViewMode;
        playerScore: number;
        bankerScore: number;
        texts: any;
    }
> {
    constructor(props) {
        super(props);
        this.state = {
            ...props,
            playerScore: 0,
            bankerScore: 0,
        };
    }

    componentDidMount() {
        const cardOpenedTimes = [
            { t: 600, c: this.state.result.player.card1, isBanker: false },
            { t: 800, c: this.state.result.player.card2, isBanker: false },
            { t: 1200, c: this.state.result.banker.card1, isBanker: true },
            { t: 2200, c: this.state.result.banker.card2, isBanker: true },
            { t: 3000, c: this.state.result.player.card3 ?? this.state.result.banker.card3, isBanker: !this.state.result.player.card3 },
            { t: 3500, c: !!this.state.result.player.card3 ? this.state.result.banker.card3 : null, isBanker: true },
        ];
        cardOpenedTimes
            .filter((ct) => !!ct.c)
            .forEach((ct, _) => {
                setTimeout(() => {
                    if (ct.isBanker) {
                        this.setState({
                            bankerScore: sumScore(this.state.bankerScore, ct.c.card),
                        });
                    } else {
                        this.setState({
                            playerScore: sumScore(this.state.playerScore, ct.c.card),
                        });
                    }
                }, ct.t);
            });
    }

    render() {
        const playerCards = GetPlayerCardsResult(this.state.result);
        const bankerCards = GetBankerCardsResult(this.state.result);

        return (
            <div className={this.state.viewMode === ViewMode.full ? "overlay-mask" : Styles["result-wrapper"]}>
                <div
                    className={`${Styles[classAnimationContainer]} ${Styles["player"]} ${
                        this.state.playResultAnimation ? "" : Styles[classMoveUpNoAnimation]
                    }`}
                >
                    {generateResult(playerCards, this.state.viewMode)}
                    <div className={`${Styles[`group-${playerCards.length}-cards`]} ${Styles["score"]}`}>
                        {this.state.texts.player}:<span className={Styles["score-number"]}> {this.state.playerScore}</span>
                    </div>
                </div>

                <div
                    className={`${Styles[classAnimationContainer]} ${Styles["banker"]} ${
                        this.state.playResultAnimation ? "" : Styles[classMoveUpNoAnimation]
                    }`}
                >
                    {generateResult(bankerCards, this.state.viewMode)}
                    <div className={`${Styles[`group-${bankerCards.length}-cards`]} ${Styles["score"]}`}>
                        {this.state.texts.banker}: <span className={Styles["score-number"]}> {this.state.bankerScore}</span>
                    </div>
                </div>
            </div>
        );
    }
}

export const BaccaratResult: React.FC<{ result?: Result }> = ({ result }) => {
    const { playResultAnimation, viewMode } = useGameContext();
    const resultCount = 4 + (!!result.player.card3 ? 1 : 0) + (!!result.banker.card3 ? 1 : 0);
    const suffix = !result.player.card3 && !!result.banker.card3 ? "-banker" : "";
    const classCardCount = `card-${resultCount}${suffix}`;
    const { gameSetting } = useGameContext();
    const { t } = useTranslation(gameSetting.gameName.toLowerCase());
    const texts = {
        player: t("player"),
        banker: t("banker"),
    };

    return (
        <div className={`${Styles["open-cards"]} ${Styles[classCardCount]}  ${playResultAnimation ? Styles[classAnimation] : ""}`}>
            <PlayerBankerResultComponent playResultAnimation={playResultAnimation} result={result} viewMode={viewMode} texts={texts} />
        </div>
    );
};

export const BaccaratResultCollapse: React.FC<{ result: Result; settlementResult: SettlementResult }> = ({ result, settlementResult }) => {
    const { gameSetting, playResultAnimation, viewMode } = useGameContext();
    const { t } = useTranslation(gameSetting.gameName.toLowerCase());
    const resultCount = 4 + (!!result.player.card3 ? 1 : 0) + (!!result.banker.card3 ? 1 : 0);
    const suffix = !result.player.card3 && !!result.banker.card3 ? "-banker" : "";
    const classCardCount = `card-${resultCount}${suffix}`;
    const texts = {
        player: t("player"),
        banker: t("banker"),
    };

    return (
        <div
            className={`${Styles["open-cards"]}  ${Styles[classCardCount]} ${Styles["result-collapse-mode"]} ${
                playResultAnimation ? Styles[classAnimation] : ""
            }`}
        >
            <PlayerBankerResultComponent playResultAnimation={playResultAnimation} result={result} viewMode={viewMode} texts={texts} />
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
