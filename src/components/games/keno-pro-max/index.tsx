import { withTranslation } from "next-i18next";
import { withRouter } from "next/router";
import React from "react";

import GameBase from "../../shared/game-base";
import { GameBaseProps, GameBaseState, GameState } from "../../shared/game-base/type";
import ScoreboardDragon from "../../shared/round-history/scoreboard/dragon";
import { KenoProMaxResult, KenoProMaxResultCollapse } from "./animations";
import KenoProMaxBetOptions from "./bet-options";
import { Result, SettlementResult } from "./keno-pro-max";
import { Choices, StatisticRuleMapping } from "./keno-pro-max-helper";
import { StatisticFollowPercent } from "../../shared/statistic";
import { ScoreboardRule } from "./scoreboard-round-history";
import TabsComponent from "./tabs";

class KenoProMax extends GameBase<GameBaseProps, GameBaseState<Result, SettlementResult>> {
    constructor(props: GameBaseProps) {
        super(props);

        this.state = { ...this.defaultState };
    }

    getMainOptions(): string[] {
        return ["big", "small", "odd", "even", "earth", "fire", "gold", "water", "wood"];
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
            <KenoProMaxBetOptions
                gameState={gameState}
                settlementResult={settlementResult ?? this.getFakeSettlementResult()}
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
        const translateDotTextMapping = {
            [Choices.big]: this.getGameTranslate("bigTextDot"),
            [Choices.small]: this.getGameTranslate("smallTextDot"),
            [Choices.odd]: this.getGameTranslate("oddTextDot"),
            [Choices.even]: this.getGameTranslate("evenTextDot"),
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
        return this.state.gameState === GameState.BeforeStartRound;
    }

    renderResult() {
        const { result, settlementResult } = this.state;

        return (
            <KenoProMaxResult
                result={result ?? [7, 9, 11, 15, 20, 22, 28, 30, 32, 34, 37, 47, 49, 53, 64, 67, 68, 70, 78, 79]}
                settlementResult={settlementResult ?? this.getFakeSettlementResult()}
            />
        );
    }

    renderResultCollapse() {
        const { result, settlementResult } = this.state;
        return (
            <KenoProMaxResultCollapse
                result={result ?? [7, 9, 11, 15, 20, 22, 28, 30, 32, 34, 37, 47, 49, 53, 64, 67, 68, 70, 78, 79]}
                settlementResult={settlementResult ?? this.getFakeSettlementResult()}
            />
        );
    }

    renderSettlementInfo() {
        return <></>;
    }
}

export default withRouter(withTranslation()(KenoProMax));
