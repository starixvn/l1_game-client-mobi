import { withTranslation } from "next-i18next";
import { withRouter } from "next/router";
import React from "react";
import GameBase from "../../shared/game-base";
import { GameBaseProps, GameBaseState } from "../../shared/game-base/type";
import ScoreboardDragon from "../../shared/round-history/scoreboard/dragon";
import { ThreeCardsResult, ThreeCardsResultCollapse } from "./animations";
import ThreeCardsBetOptions from "./bet-options";
import { ScoreboardRule, GetScoreboardDotDetailsOfSuits } from "./scoreboard-round-history";
import { Result, SettlementResult } from "./three-cards";
import ThreeCardsStatistic, { StatisticRuleMapping } from "./statistic";
import { Choices, TabsValue, SuitOrder } from "./three-cards-helper";
import Styles from "./three-cards.module.scss";
import ScoreboardBasic from "../../shared/round-history/scoreboard/basic";
import ScoreboardTab from "../../shared/scoreboard-tab";

class ThreeCards extends GameBase<GameBaseProps, GameBaseState<Result, SettlementResult>> {
    constructor(props: GameBaseProps) {
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
                tabWinningStreak: this.getWinningStreakByOptions(["red", "black"]),
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
        const suits = ["hearts", "diamonds", "clubs", "spades"];
        const resultUniqueSuit = result.map((card) => card.suit).filter((value, index, self) => self.indexOf(value) === index);
        const suitsLength = `suit-length-${resultUniqueSuit.length}`;

        return (
            <div className={Styles["result-container"]}>
                <div className={settlementResult.red ? Styles["result-info-red"] : Styles["result-info-black"]}>
                    {this.getGameTranslate(settlementResult.red ? "red" : "black")}
                </div>
                <div className={`${Styles["suits"]} ${Styles[suitsLength]}`}>
                    {SuitOrder.map((suit, index) => {
                        if (resultUniqueSuit.includes(suit)) {
                            return (
                                <img
                                    key={index}
                                    srcSet={`/static/images/three-cards/${suits[suit]}.png 1x, /static/images/three-cards/${suits[suit]}@2x.png 2x, /static/images/three-cards/${suits[suit]}@3x.png 3x`}
                                    height={30}
                                    width={30}
                                    alt={suits[suit]}
                                />
                            );
                        }
                    })}
                </div>
            </div>
        );
    }
}

export default withRouter(withTranslation()(ThreeCards));
