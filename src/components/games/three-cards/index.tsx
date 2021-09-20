import { withTranslation } from "next-i18next";
import { withRouter } from "next/router";
import React from "react";

import GatewayGameBase from "../../shared/game-base/gateway-gamebase";
import { GameBaseState, GatewayGameBaseProps } from "../../shared/game-base/type";
import ScoreboardBasic from "../../shared/round-history/scoreboard/basic";
import ScoreboardDragon from "../../shared/round-history/scoreboard/dragon";
import ScoreboardTab from "../../shared/scoreboard-tab";
import { ThreeCardsResult, ThreeCardsResultCollapse } from "./animations";
import ThreeCardsBetOptions from "./bet-options";
import { GetScoreboardDotDetailsOfSuits, ScoreboardRule } from "./scoreboard-round-history";
import ThreeCardsStatistic, { StatisticRuleMapping } from "./statistic";
import { Result, SettlementResult } from "./three-cards";
import { Choices, SuitKeys, SuitOrder, TabsValue } from "./three-cards-helper";
import Styles from "./three-cards.module.scss";

class ThreeCards extends GatewayGameBase<GatewayGameBaseProps, GameBaseState<Result, SettlementResult>> {
    constructor(props: GatewayGameBaseProps) {
        super(props);

        this.state = { ...this.defaultState };
    }

    getMainOptions(): string[] {
        return ["black", "red"];
    }

    renderBetOptions() {
        const { gameState, settlementResult, showWinningAnimation } = this.state;
        const fakeSettlementResult = { red: true, black: false, diamonds: true, hearts: false, spades: false, clubs: true };
        return (
            <ThreeCardsBetOptions
                gameState={gameState}
                settlementResult={settlementResult ?? fakeSettlementResult}
                isShowWinningEffect={showWinningAnimation}
            />
        );
    }

    getRoundHistoryTabStyles() {
        return Styles["round-history-tabs"];
    }

    renderRoundHistory() {
        const sourceTabsValue = {
            redBlack: {
                tabName: this.getGameTranslate("redBlackTabs"),
                tabWinningStreak: this.getWinningStreakByOptions({ options: ["red", "black"] }),
            },
            suits: {
                tabName: this.getGameTranslate("suitsTabs"),
                tabWinningStreak: 0,
            },
        };

        return (
            <ScoreboardTab
                key={this.state.roundId}
                tabsValue={sourceTabsValue}
                activeScoreboardTab={this.state.activeScoreboardTab}
            ></ScoreboardTab>
        );
    }

    renderStatistic() {
        const statisticRuleEntries = StatisticRuleMapping[this.state.activeScoreboardTab];

        return (
            <ThreeCardsStatistic
                roundHistory={this.state.roundHistory}
                statisticRuleEntries={statisticRuleEntries}
                activeScoreboardTab={this.state.activeScoreboardTab}
            ></ThreeCardsStatistic>
        );
    }

    renderBoard() {
        const { roundHistory, activeScoreboardTab, gameState } = this.state;
        if (activeScoreboardTab === TabsValue.suits) {
            return (
                <ScoreboardBasic
                    roundHistory={roundHistory}
                    gameState={gameState}
                    getDotDetails={GetScoreboardDotDetailsOfSuits}
                ></ScoreboardBasic>
            );
        } else {
            const translateDotTextMapping = {
                [Choices.red]: this.getGameTranslate("redTextDot"),
                [Choices.black]: this.getGameTranslate("blackTextDot"),
            };

            return (
                <ScoreboardDragon
                    roundHistory={roundHistory}
                    getDotDetails={ScoreboardRule[activeScoreboardTab]?.GetScoreboardDotDetails}
                    conditionChangeDot={ScoreboardRule[activeScoreboardTab]?.conditionChangeDot}
                    translateDotTextMapping={translateDotTextMapping}
                />
            );
        }
    }

    renderResult() {
        return (
            <ThreeCardsResult
                result={
                    this.state.result ?? [
                        { rank: "Q", suit: 1 },
                        { rank: "10", suit: 2 },
                        { rank: "4", suit: 1 },
                    ]
                }
            />
        );
    }

    renderResultCollapse() {
        const { result, settlementResult } = this.state;
        return (
            <ThreeCardsResultCollapse
                result={
                    result ?? [
                        { rank: "Q", suit: 1 },
                        { rank: "10", suit: 2 },
                        { rank: "4", suit: 1 },
                    ]
                }
                settlementResult={settlementResult}
            />
        );
    }

    isRedSuit(suit: number) {
        return suit === 0 || suit === 1;
    }
    renderSettlementInfo() {
        const { result, settlementResult } = this.state;
        const resultUniqueSuit = result.map((card) => card.suit).filter((value, index, self) => self.indexOf(value) === index);
        const suitsLength = `suit-length-${resultUniqueSuit.length}`;
        const getSrcSetImg = (suit: number) => {
            const source1X = `/static/images/three-cards/${SuitKeys[suit]}.png 1x`;
            const source2X = `/static/images/three-cards/${SuitKeys[suit]}@2x.png 2x`;
            const source3X = `/static/images/three-cards/${SuitKeys[suit]}@3x.png 3x`;
            return `${source1X}, ${source2X}, ${source3X}`;
        };
        return (
            <div className={Styles["result-container"]}>
                <div className={settlementResult.red ? Styles["result-info-red"] : Styles["result-info-black"]}>
                    {this.getGameTranslate(settlementResult.red ? "red" : "black")}
                </div>
                <div className={`${Styles["suits"]} ${Styles[suitsLength]}`}>
                    {SuitOrder.map((suit, index) => {
                        if (resultUniqueSuit.includes(suit)) {
                            return <img key={index} srcSet={getSrcSetImg(suit)} height={30} width={30} alt={SuitKeys[suit]} />;
                        }
                        return null;
                    })}
                </div>
            </div>
        );
    }
}

export default withRouter(withTranslation()(ThreeCards));
