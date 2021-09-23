import { withTranslation } from "next-i18next";
import { withRouter } from "next/router";
import React from "react";
import GameBase from "../../shared/game-base";

import { GameBaseProps, GameBaseState, GameState } from "../../shared/game-base/type";
import ScoreboardDragon from "../../shared/round-history/scoreboard/dragon";
import ScoreboardTab from "../../shared/scoreboard-tab";
import { StatisticFollowPercent } from "../../shared/statistic";
import { KenoPowerResult, KenoPowerResultCollapse } from "./animations";
import KenoPowerOptions from "./bet-options";
import { Result, SettlementResult } from "./keno-power";
import { Choices, StatisticRuleMapping } from "./keno-power-helper";
import { ScoreboardRule } from "./scoreboard-round-history";

class KenoPower extends GameBase<GameBaseProps, GameBaseState<Result, SettlementResult>> {
    constructor(props: GameBaseProps) {
        super(props);

        this.state = { ...this.defaultState };
    }

    retryConnect = () => {
        this.onStart();
    };

    onDestroy() {
        super.onDestroy();
        this.socket && this.socket.disconnect();
    }

    getMainOptions(): string[] {
        return ["big", "small", "odd", "even"];
    }

    getFakeSettlementResult() {
        return {
            big: true,
            earth: false,
            even: true,
            fire: false,
            gold: false,
            odd: false,
            small: false,
            water: true,
            wood: false,
        };
    }

    renderBetOptions() {
        const { gameState, settlementResult, showWinningAnimation } = this.state;
        return (
            <KenoPowerOptions
                gameState={gameState}
                settlementResult={settlementResult ?? this.getFakeSettlementResult()}
                isShowWinningEffect={showWinningAnimation}
            />
        );
    }

    renderRoundHistory() {
        const sourceTabsValue = {
            bigSmall: {
                tabName: this.getGameTranslate("bigSmallTabs"),
                tabWinningStreak: this.getWinningStreakByOptions({ options: ["big", "small"] }),
            },
            oddEven: {
                tabName: this.getGameTranslate("evenOddTabs"),
                tabWinningStreak: this.getWinningStreakByOptions({ options: ["odd", "even"] }),
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
        return (
            <StatisticFollowPercent
                roundHistory={this.state.roundHistory}
                statisticRuleEntries={StatisticRuleMapping[this.state.activeScoreboardTab]}
                activeScoreboardTab={this.state.activeScoreboardTab}
            ></StatisticFollowPercent>
        );
    }

    renderBoard() {
        const { roundHistory, activeScoreboardTab } = this.state;
        const translateDotTextMapping = {
            [Choices.big]: this.getGameTranslate("bigTextDot"),
            [Choices.small]: this.getGameTranslate("smallTextDot"),
            [Choices.odd]: this.getGameTranslate("oddTextDot"),
            [Choices.even]: this.getGameTranslate("evenTextDot"),
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

    get isShowStartRoundAnimation() {
        return this.state.gameState === GameState.BeforeStartRound;
    }

    renderStartRoundAnimation() {
        return <></>;
    }

    renderResult() {
        return <></>;
    }

    renderResultCollapse() {
        return <></>;
    }

    renderSettlementInfo() {
        return <></>;
    }
}

export default withRouter(withTranslation()(KenoPower));
