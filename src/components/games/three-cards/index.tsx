import { withTranslation } from "next-i18next";
import { withRouter } from "next/router";
import React from "react";
import GameBase from "../../shared/game-base";
import { GameBaseProps, GameBaseState, GameState } from "../../shared/game-base/type";
import ChainRoundHistory from "../../shared/round-history/chain";
import ScoreboardDragon from "../../shared/round-history/scoreboard/dragon";
import { ThreeCardsResult, ThreeCardsResultCollapse, DrawCardsAnimation, getSettleResult } from "./animations";
import ThreeCardsBetOptions from "./bet-options";
import { RenderRoundDetail, RenderThreeCardsDot } from "./round-history";
import { ScoreboardRule, GetElementRoundSuits } from "./scoreboard-round-history";
import { Result, SettlementResult } from "./three-cards";
import ThreeCardsStatistic, { StatisticRuleMapping } from "./statistic";
import { Choices } from "./three-cards-helper";
import TabsComponent, { TabsValue } from "./tabs";
import Styles from "./three-cards.module.scss";
import ScoreboardBasic from "../../shared/round-history/scoreboard/basic";

class ThreeCards extends GameBase<GameBaseProps, GameBaseState<Result, SettlementResult>> {
    constructor(props: GameBaseProps) {
        super(props);

        this.state = { ...this.defaultState };
    }

    getMainOptions(): string[] {
        return ["black", "red", "diamonds", "hearts", "spades", "clubs"];
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
        const { gameState, roundHistory } = this.state;
        return (
            <>
                <ChainRoundHistory
                    roundHistory={roundHistory}
                    gameState={gameState}
                    renderGameDot={RenderThreeCardsDot}
                    renderRoundDetail={RenderRoundDetail}
                ></ChainRoundHistory>
                <TabsComponent></TabsComponent>
            </>
        );
    }

    renderStatistic() {
        const statisticRuleEntries = StatisticRuleMapping[this.state.tabsScoreboardValue];

        return (
            <ThreeCardsStatistic
                roundHistory={this.state.roundHistory}
                statisticRuleEntries={statisticRuleEntries}
                tabsScoreboardValue={this.state.tabsScoreboardValue}
            ></ThreeCardsStatistic>
        );
    }

    renderBoard() {
        const { roundHistory, tabsScoreboardValue, gameState } = this.state;
        switch (tabsScoreboardValue) {
            case TabsValue.suits:
                return (
                    <ScoreboardBasic
                        roundHistory={roundHistory}
                        gameState={gameState}
                        getElementRound={GetElementRoundSuits}
                    ></ScoreboardBasic>
                );

            default:
                const gameName = this.props.gameName.toLowerCase();
                const translateDotTextMapping = {
                    [Choices.red]: this.props.t(`${gameName}:redTextDot`),
                    [Choices.black]: this.props.t(`${gameName}:blackTextDot`),
                };

                return (
                    <ScoreboardDragon
                        roundHistory={roundHistory}
                        getElementRound={ScoreboardRule[tabsScoreboardValue]?.elementRound}
                        checkCondition={ScoreboardRule[tabsScoreboardValue]?.condition}
                        translateDotTextMapping={translateDotTextMapping}
                    />
                );
        }
    }

    get isShowStartRoundAnimation() {
        return (
            this.state.gameState === GameState.BeforeStartRound ||
            this.state.gameState === GameState.InRound ||
            this.state.gameState === GameState.LockingBet
        );
    }

    renderStartRoundAnimation() {
        const { durations } = this.props;
        return <DrawCardsAnimation playAnimation={this.timeCounter >= durations.placingBets + durations.beforeStartRound} />;
    }

    renderResult() {
        const { result } = this.state;
        return (
            <ThreeCardsResult
                result={
                    result ?? [
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

    renderSettlementInfo() {
        return <></>;
    }
}

export default withRouter(withTranslation()(ThreeCards));
