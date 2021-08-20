import { useTranslation } from "next-i18next";
import React from "react";

import { useGameContext } from "../../../../contexts/game-context/game-context";
import Card from "../../../shared/card";
import { ViewMode } from "../../../shared/game-base/type";
import { CardOrder, Result, SettlementResult } from "../baccarat";
import { GetBankerCardsResult, GetPlayerCardsResult } from "../baccarat-helper";
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
                    <Card result={card.value} viewMode={viewMode} customClassName={"card-baccarat"}></Card>
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
        cardThreeOptions: { isOpenCardThree: boolean; setIsOpenCardThree: Function };
    },
    {
        playResultAnimation: boolean;
        result?: Result;
        viewMode: ViewMode;
        playerScore: number;
        bankerScore: number;
        texts: any;
        openedCards: number;
    }
> {
    private readonly timeouts: NodeJS.Timeout[] = [];

    constructor(props) {
        super(props);

        this.state = {
            ...props,
            playerScore: 0,
            bankerScore: 0,
            openedCards: 0,
        };
    }

    componentDidMount() {
        if (this.props.playResultAnimation) {
            const isOpenCardThree = this.props.cardThreeOptions.isOpenCardThree;
            const tOpenPlayer1 = isOpenCardThree ? 0 : 700;
            const tOpenPlayer2 = isOpenCardThree ? 0 : 2300;
            const tOpenPlayer3 = isOpenCardThree ? 1300 : 4400;
            const tOpenBanker1 = isOpenCardThree ? 0 : 1500;
            const tOpenBanker2 = isOpenCardThree ? 0 : 3100;
            const tOpenBanker3 = isOpenCardThree ? 1400 : 5800;

            const cardOpenedTimes = [
                { t: tOpenPlayer1, c: this.props.result.player.card1, isBanker: false },
                { t: tOpenBanker1, c: this.props.result.banker.card1, isBanker: true },
                { t: tOpenPlayer2, c: this.props.result.player.card2, isBanker: false },
                { t: tOpenBanker2, c: this.props.result.banker.card2, isBanker: true },
                {
                    t: tOpenPlayer3,
                    c: this.props.result.player.card3 ?? this.props.result.banker.card3,
                    isBanker: !this.props.result.player.card3,
                },
                { t: tOpenBanker3, c: !!this.props.result.player.card3 ? this.props.result.banker.card3 : null, isBanker: true },
            ];

            cardOpenedTimes
                .filter((ct) => !!ct.c)
                .forEach((ct, i) => {
                    if (i === 2) {
                        this.props.cardThreeOptions.setIsOpenCardThree(true);
                    }
                    const timeout = setTimeout(() => {
                        if (ct.isBanker) {
                            this.setState({
                                bankerScore: sumScore(this.state.bankerScore, ct.c.card),
                                openedCards: i + 1,
                            });
                        } else {
                            this.setState({
                                playerScore: sumScore(this.state.playerScore, ct.c.card),
                                openedCards: i + 1,
                            });
                        }
                    }, ct.t);
                    this.timeouts.push(timeout);
                });
        } else {
            let pc = sumScore(0, this.props.result.player.card1.card);
            pc = sumScore(pc, this.props.result.player.card2.card);
            pc = sumScore(pc, this.props.result.player.card3?.card ?? -1);

            let bc = sumScore(0, this.props.result.banker.card1.card);
            bc = sumScore(bc, this.props.result.banker.card2.card);
            bc = sumScore(bc, this.props.result.banker.card3?.card ?? -1);

            this.setState({
                playerScore: pc,
                bankerScore: bc,
            });
        }
    }

    componentWillUnmount() {
        if (this.timeouts && this.timeouts.length) {
            this.timeouts.forEach((timeout) => {
                clearTimeout(timeout);
            });
        }
    }

    render() {
        const playerCards = GetPlayerCardsResult(this.props.result);
        const bankerCards = GetBankerCardsResult(this.props.result);
        const isFullMode = this.state.viewMode === ViewMode.full;
        const classOpenCards = `opened-cards-${this.state.openedCards}`;
        const classGroupPlayerCards = `group-${playerCards.length}-cards`;
        const classGroupBankerCards = `group-${bankerCards.length}-cards`;
        return (
            <div className={`${isFullMode ? "overlay-mask" : Styles["result-wrapper"]} ${Styles[classOpenCards]}`}>
                <div
                    className={`${Styles[classAnimationContainer]} ${Styles["player"]} ${
                        this.props.playResultAnimation ? "" : Styles[classMoveUpNoAnimation]
                    }`}
                >
                    {generateResult(playerCards, this.state.viewMode)}
                    <div className={`${Styles[classGroupPlayerCards]} ${Styles["score"]}`}>
                        {isFullMode ? `${this.state.texts.player}: ` : ""}
                        <span className={Styles["score-number"]}>{this.state.playerScore}</span>
                    </div>
                </div>

                <div
                    className={`${Styles[classAnimationContainer]} ${Styles["banker"]} ${
                        this.props.playResultAnimation ? "" : Styles[classMoveUpNoAnimation]
                    }`}
                >
                    {generateResult(bankerCards, this.state.viewMode)}
                    <div className={`${Styles[classGroupBankerCards]} ${Styles["score"]}`}>
                        {isFullMode ? `${this.state.texts.banker}: ` : ""}
                        <span className={Styles["score-number"]}>{this.state.bankerScore}</span>
                    </div>
                </div>
            </div>
        );
    }
}

export const BaccaratResult: React.FC<{ result?: Result; isOpenCardThree: boolean; setIsOpenCardThree: Function }> = ({
    result,
    isOpenCardThree,
    setIsOpenCardThree,
}) => {
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
            <PlayerBankerResultComponent
                playResultAnimation={playResultAnimation}
                result={result}
                viewMode={viewMode}
                texts={texts}
                cardThreeOptions={{ isOpenCardThree, setIsOpenCardThree }}
            />
        </div>
    );
};

export const BaccaratResultCollapse: React.FC<{
    result: Result;
    settlementResult: SettlementResult;
    isOpenCardThree: boolean;
    setIsOpenCardThree: Function;
}> = ({ result, settlementResult, isOpenCardThree, setIsOpenCardThree }) => {
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
            <PlayerBankerResultComponent
                playResultAnimation={playResultAnimation}
                result={result}
                viewMode={viewMode}
                texts={texts}
                cardThreeOptions={{ isOpenCardThree, setIsOpenCardThree }}
            />
            {!playResultAnimation && settlementResult && (
                <div className={Styles["result-label"]}>
                    {settlementResult.player ? t("player") : settlementResult.banker ? t("banker") : t("tie")}
                </div>
            )}
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
