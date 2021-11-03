import { withTranslation } from "next-i18next";
import { withRouter } from "next/router";
import React from "react";

import GatewayGameBase from "../../shared/game-base/gateway-gamebase";
import { GameBaseState, GatewayGameBaseProps } from "../../shared/game-base/type";
import ScoreboardDragon from "../../shared/round-history/scoreboard/dragon";
import ScoreboardTab from "../../shared/scoreboard-tab";
import { StatisticFollowPercent } from "../../shared/statistic";
import { BaccaratResult, BaccaratResultCollapse, generateSettlementInfo } from "./animations";
import { Result, SettlementResult } from "./baccarat";
import { Choices, GetTranslateChoiceMapping, StatisticRuleMapping, ChoiceForTabActive } from "./baccarat-helper";
import BaccaratBetOptions from "./bet-options";

class Baccarat extends GatewayGameBase<GatewayGameBaseProps, GameBaseState<Result, SettlementResult>> {
    constructor(props: GatewayGameBaseProps) {
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
                tabWinningStreak: this.getWinningStreakByOptions({ options: ["player", "banker", "tie"] }),
            },
            bigSmall: {
                tabName: this.getGameTranslate("bigSmallTabs"),
                tabWinningStreak: this.getWinningStreakByOptions({ options: ["big", "small"] }),
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
        const roundHistory = this.state.roundHistory.length > 100 ? this.state.roundHistory.slice(0, 100) : this.state.roundHistory;
        return (
            <StatisticFollowPercent
                roundHistory={roundHistory}
                statisticRuleEntries={StatisticRuleMapping[this.state.activeScoreboardTab]}
                activeScoreboardTab={this.state.activeScoreboardTab}
            ></StatisticFollowPercent>
        );
    }

    renderBoard() {
        const { activeScoreboardTab } = this.state;
        const roundHistory = this.state.roundHistory.length > 100 ? this.state.roundHistory.slice(0, 100) : this.state.roundHistory;
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
                dotDetails={{
                    translateDotTextMapping: translateDotTextMapping,
                    choice: ChoiceForTabActive[activeScoreboardTab].choice,
                }}
            />
        );
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

        if (result) {
            const noOfCards = 4 + (!!result.banker.card3 ? 1 : 0) + (!!result.player.card3 ? 1 : 0);
            const resultAnimation = noOfCards === 4 ? durations.resultAnimation : noOfCards === 5 ? 6 : 8;
            return (resultAnimation + (durations.balancingBet ?? 0)) * 1000;
        }

        return super.getFinishAnimationDuration();
    }
}

export default withRouter(withTranslation()(Baccarat));
