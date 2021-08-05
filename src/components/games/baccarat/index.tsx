import React from "react";
import { withTranslation } from "next-i18next";
import { withRouter } from "next/router";

import GameBase from "../../shared/game-base";
import { GameBaseProps, GameBaseState, GameState } from "../../shared/game-base/type";
import ScoreboardDragon from "../../shared/round-history/scoreboard/dragon";
import { BaccaratResult, BaccaratResultCollapse, DrawCardsAnimation, generateSettlementInfo } from "./animations";
import BaccaratBetOptions from "./bet-options";
import { ScoreboardRule } from "./scoreboard-round-history";
import { Result, SettlementResult } from "./baccarat";
import { Choices, StatisticRuleMapping, GetTranslateChoiceMapping } from "./baccarat-helper";
import { StatisticFollowPercent } from "../../shared/statistic";
import TabsComponent from "../../shared/round-history/tabs";

class Baccarat extends GameBase<GameBaseProps, GameBaseState<Result, SettlementResult>> {
    constructor(props: GameBaseProps) {
        super(props);

        this.state = { ...this.defaultState };
    }

    getMainOptions(): string[] {
        return ["player", "banker", "big", "small", "tie"];
    }

    renderBetOptions() {
        const { gameState, settlementResult, showWinningAnimation } = this.state;
        const fakeSettlementResult = {
            banker: false,
            bankerPair: false,
            big: true,
            natural: false,
            player: true,
            playerPair: false,
            small: false,
            tie: false,
        };
        return (
            <BaccaratBetOptions
                gameState={gameState}
                settlementResult={settlementResult ?? fakeSettlementResult}
                isShowWinningEffect={showWinningAnimation}
            />
        );
    }

    renderRoundHistory() {
        const sourceTabsValue = {
            playerBanKer: {
                tabName: this.getGameTranslate("playerBankerTabs"),
                tabWinningStreak: this.getWinningStreakByOptions(["player", "banker", "tie"]),
            },
            bigSmall: {
                tabName: this.getGameTranslate("bigSmallTabs"),
                tabWinningStreak: this.getWinningStreakByOptions(["big", "small"]),
            },
        };
        return <TabsComponent key={this.state.roundId} tabsValue={sourceTabsValue}></TabsComponent>;
    }

    renderStatistic() {
        return (
            <StatisticFollowPercent
                roundHistory={this.state.roundHistory}
                statisticRuleEntries={StatisticRuleMapping[this.state.tabsScoreboardValue]}
                tabsScoreboardValue={this.state.tabsScoreboardValue}
            ></StatisticFollowPercent>
        );
    }

    renderBoard() {
        const { roundHistory, tabsScoreboardValue } = this.state;
        const translateDotTextMapping = {
            [Choices.banker]: this.getGameTranslate("bankerTextDot"),
            [Choices.player]: this.getGameTranslate("playerTextDot"),
            [Choices.tie]: this.getGameTranslate("tieTextDot"),
            [Choices.big]: this.getGameTranslate("bigTextDot"),
            [Choices.small]: this.getGameTranslate("smallTextDot"),
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
        return (
            <BaccaratResult
                result={
                    this.state.result ?? {
                        banker: { card1: { card: 1, type: 0 }, card2: { card: 11, type: 2 }, card3: { card: 12, type: 2 } },
                        player: { card1: { card: 8, type: 3 }, card2: { card: 5, type: 3 }, card3: { card: 8, type: 1 } },
                    }
                }
            />
        );
    }

    renderResultCollapse() {
        const { result, settlementResult } = this.state;
        return (
            <BaccaratResultCollapse
                result={
                    result ?? {
                        banker: { card1: { card: 1, type: 0 }, card2: { card: 11, type: 2 }, card3: { card: 12, type: 2 } },
                        player: { card1: { card: 8, type: 3 }, card2: { card: 5, type: 3 }, card3: { card: 8, type: 1 } },
                    }
                }
                settlementResult={settlementResult}
            />
        );
    }

    renderSettlementInfo() {
        const { settlementResult } = this.state;
        const resources = GetTranslateChoiceMapping(this.props.t, this.props.gameName.toLowerCase());

        return generateSettlementInfo(settlementResult, resources);
    }

    getFinishAnimationDuration() {
        const { durations } = this.props;
        const { result } = this.state;
        const resultAnimation = !!result.banker.card3 || !!result.player.card3 ? 4 : durations.resultAnimation;
        return (resultAnimation + (durations.balancingBet ?? 0)) * 1000;
    }
}

export default withRouter(withTranslation()(Baccarat));
