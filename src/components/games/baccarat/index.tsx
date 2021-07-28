import { withTranslation } from "next-i18next";
import { withRouter } from "next/router";
import React from "react";
import GameBase from "../../shared/game-base";
import { GameBaseProps, GameBaseState, GameState } from "../../shared/game-base/type";
import ScoreboardDragon from "../../shared/round-history/scoreboard/dragon";
import { BaccaratResult, BaccaratResultCollapse, DrawCardsAnimation, generateSettlementInfo } from "./animations";
import BaccaratBetOptions from "./bet-options";
import { ScoreboardRule } from "./scoreboard-round-history";
import Styles from "./baccarat.module.scss";
import { Result, SettlementResult } from "./baccarat";
import TabsComponent from "./tabs";
import { Choices, StatisticRuleMapping } from "./baccarat-helper";
import { StatisticFollowPercent } from "../../shared/statistic";

class Baccarat extends GameBase<GameBaseProps, GameBaseState<Result, SettlementResult>> {
    constructor(props: GameBaseProps) {
        super(props);

        this.state = { ...this.defaultState };
    }

    getMainOptions(): string[] {
        return ["player", "banker", "big", "small", "tie", "playerPair", "bankerPair"];
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
        return <TabsComponent></TabsComponent>;
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
        const gameName = this.props.gameName.toLowerCase();
        const translateDotTextMapping = {
            [Choices.banker]: this.props.t(`${gameName}:bankerTextDot`),
            [Choices.player]: this.props.t(`${gameName}:playerTextDot`),
            [Choices.tie]: this.props.t(`${gameName}:tieTextDot`),
            [Choices.big]: this.props.t(`${gameName}:bigTextDot`),
            [Choices.small]: this.props.t(`${gameName}:smallTextDot`),
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
        const { result } = this.state;
        return (
            <BaccaratResult
                result={
                    result ?? {
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
        const resources = {
            player: this.getGameTranslate("player"),
            banker: this.getGameTranslate("banker"),
            tie: this.getGameTranslate("tie"),
            playerPair: this.getGameTranslate("playerPair"),
            bankerPair: this.getGameTranslate("bankerPair"),
            big: this.getGameTranslate("big"),
            small: this.getGameTranslate("small"),
        };

        return generateSettlementInfo(settlementResult, resources);
    }

    getFinishAnimationDuration() {
        const { durations } = this.props;
        const { result } = this.state;
        const resultAnimation = !!result.banker.card3 || !!result.player.card3 ? 9 : durations.resultAnimation;
        return (resultAnimation + (durations.balancingBet ?? 0)) * 1000;
    }
}

export default withRouter(withTranslation()(Baccarat));
