import { withTranslation } from "next-i18next";
import { withRouter } from "next/router";
import React from "react";

import GameBase from "../../shared/game-base";
import { GameBaseState, GameState, GameBaseProps } from "../../shared/game-base/type";
import ScoreboardDragon from "../../shared/round-history/scoreboard/dragon";
import ScoreboardTab from "../../shared/scoreboard-tab";
import { StatisticFollowPercent } from "../../shared/statistic";
import { RoundResultCollapse } from "../keno-pro-max/round-result";
import { MegaKenoResult } from "../mega-keno/mega-keno-result";

import KenoProMaxBetOptions from "../keno-pro-max/bet-options";
import OverlayMaskWhite from "../../shared/overlay-mask-white";
import { Result, SettlementResult } from "../keno-pro-max/keno-pro-max";
import { Choices, StatisticRuleMapping, ChoiceForTabActive } from "../keno-pro-max/keno-pro-max-helper";

const DefaultResult = Array(20).fill(0);
export class MiniKeno extends GameBase<GameBaseProps, GameBaseState<Result, SettlementResult>> {
    constructor(props: GameBaseProps) {
        super(props);

        this.state = { ...this.defaultState };
    }

    get winningAnimationWaitingTimeInSecond() {
        return this.getFinishAnimationDuration() + 1000;
    }

    get defaultResult() {
        return DefaultResult;
    }

    get defaultSettlementResult() {
        return {};
    }

    getMainOptions(): string[] {
        return ["big", "small", "odd", "even"];
    }

    getFakeSettlementResult() {
        const { roundHistory } = this.state;
        return (
            roundHistory?.[0]?.settlementResult ?? {
                big: true,
                earth: false,
                even: true,
                fire: false,
                gold: false,
                odd: false,
                small: false,
                water: true,
                wood: false,
            }
        );
    }

    getFakeResult() {
        const { roundHistory } = this.state;
        return roundHistory?.[0]?.result ?? [7, 9, 11, 15, 20, 22, 28, 30, 32, 34, 37, 47, 49, 53, 64, 67, 68, 70, 78, 79];
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

    renderResult() {
        const { result, settlementResult } = this.state;
        return (
            <MegaKenoResult result={result ?? this.getFakeResult()} settlementResult={settlementResult ?? this.getFakeSettlementResult()} />
        );
    }

    renderResultCollapse() {
        const { result, settlementResult, gameState } = this.state;
        return (
            <RoundResultCollapse
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

export default withRouter(withTranslation()(MiniKeno));
