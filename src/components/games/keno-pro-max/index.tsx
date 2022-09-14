import { withTranslation } from "next-i18next";
import { withRouter } from "next/router";
import React from "react";

import GatewayGameBase from "../../shared/game-base/gateway-gamebase";
import { GameBaseState, GameState, GatewayGameBaseProps } from "../../shared/game-base/type";
import ScoreboardDragon from "../../shared/round-history/scoreboard/dragon";
import ScoreboardTab from "../../shared/scoreboard-tab";
import { StatisticFollowPercent } from "../../shared/statistic";
import { MegaKenoRoundResultCollapse, RoundResult, RoundResultCollapse } from "./round-result";
import KenoProMaxBetOptions, { TooltipMessageFollowChoiceProps } from "./bet-options";
import OverlayMaskWhite from "../../shared/overlay-mask-white";
import { Result, SettlementResult } from "./keno-pro-max";
import { Choices, StatisticRuleMapping, ChoiceForTabActive } from "./keno-pro-max-helper";
import { MegaKenoResult } from "./round-result/mini-keno-result";

const DefaultResult = Array(20).fill(0);
export const DefaultTooltipMessageFollowChoiceProps = {
    big: `[811~1410]`,
    small: `[210~810]`,
    gold: `[210~695]`,
    wood: `[696~763]`,
    water: `[764~855]`,
    fire: `[856~923]`,
    earth: `[924~1410]`,
};

export class KenoProMax extends GatewayGameBase<GatewayGameBaseProps, GameBaseState<Result, SettlementResult>> {
    constructor(props: GatewayGameBaseProps) {
        super(props);

        this.state = { ...this.defaultState };
    }

    get winningAnimationWaitingTimeInSecond() {
        return this.getFinishAnimationDuration() + 1000;
    }

    get isShowPoolStake() {
        return true;
    }

    get isShowInlineResult() {
        return false;
    }

    get defaultResult() {
        return DefaultResult;
    }

    get defaultSettlementResult() {
        return {};
    }

    get tooltipMessageFollowChoiceProps(): TooltipMessageFollowChoiceProps {
        return DefaultTooltipMessageFollowChoiceProps;
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

    renderResultSection() {
        const { result, settlementResult, gameState, showResultInfo } = this.state;
        return <RoundResult result={result} settlementResult={settlementResult} gameState={gameState} showResultInfo={showResultInfo} />;
    }

    renderBetOptions() {
        const { gameState, settlementResult, showWinningAnimation, showResultInfo } = this.state;
        return (
            <>
                {gameState === GameState.DisplayResult && !showResultInfo && <OverlayMaskWhite />}
                <KenoProMaxBetOptions
                    gameState={gameState}
                    settlementResult={settlementResult ?? this.getFakeSettlementResult()}
                    isShowWinningEffect={showWinningAnimation}
                    isShowPoolStake={this.isShowPoolStake}
                    tooltipMessageFollowChoiceProps={this.tooltipMessageFollowChoiceProps}
                />
            </>
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
            fiveElement: {
                tabName: this.getGameTranslate("fiveElementsTabs"),
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
                dotDetails={{
                    translateDotTextMapping: translateDotTextMapping,
                    choice: ChoiceForTabActive[activeScoreboardTab]?.choice,
                }}
            />
        );
    }

    get isShowStartRoundAnimation() {
        return this.state.gameState === GameState.BeforeStartRound;
    }

    getFakeResult() {
        const { roundHistory } = this.state;
        return roundHistory?.[0]?.result ?? [7, 9, 11, 15, 20, 22, 28, 30, 32, 34, 37, 47, 49, 53, 64, 67, 68, 70, 78, 79];
    }

    renderResult() {
        const { result, settlementResult } = this.state;
        return (
            <MegaKenoResult result={result ?? this.getFakeResult()} settlementResult={settlementResult ?? this.getFakeSettlementResult()} />
        );
    }

    renderResultCollapse() {
        const { result, settlementResult, gameState } = this.state;
        return (
            <MegaKenoRoundResultCollapse
                result={result ?? this.getFakeResult()}
                settlementResult={settlementResult ?? this.getFakeSettlementResult()}
                gameState={gameState}
            />
        );
    }

    renderSettlementInfo() {
        return <></>;
    }
}

export default withRouter(withTranslation()(KenoProMax));
