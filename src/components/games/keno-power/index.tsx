import { withTranslation } from "next-i18next";
import { withRouter } from "next/router";
import React from "react";
import TeamResult from "../../keno/team-result";
import GameBase from "../../shared/game-base";

import { GameBaseProps, GameBaseState, GameState } from "../../shared/game-base/type";
import ScoreboardDragon from "../../shared/round-history/scoreboard/dragon";
import ScoreboardTab from "../../shared/scoreboard-tab";
import { StatisticFollowPercent } from "../../shared/statistic";
import KenoPowerOptions from "./bet-options";
import { KenoPowerGameState, Result, SettlementResult } from "./keno-power";
import { Choices, StatisticRuleMapping, ChoiceForTabActive } from "./keno-power-helper";
import { RoundResult } from "./round-result";

class KenoPower extends GameBase<GameBaseProps, KenoPowerGameState> {
    constructor(props: GameBaseProps) {
        super(props);

        this.state = { ...this.defaultState, result: { red: Array<number>(20), blue: Array<number>(20) }, md5: "" };
    }

    retryConnect = () => {
        this.onStart();
    };

    onDestroy() {
        super.onDestroy();
        this.socket && this.socket.disconnect();
    }

    getMainOptions(): string[] {
        return ["blue", "red", "big", "small", "odd", "even", "blueBig", "blueSmall", "redBig", "redSmall"];
    }

    getOptionalWinStreakByOptions({ option }) {
        let text = "";
        if (["blueBig", "blueSmall"].includes(option)) {
            return (text = this.getGameTranslate("blue"));
        }

        if (["redBig", "redSmall"].includes(option)) {
            return (text = this.getGameTranslate("blue"));
        }
        return text;
    }

    getFakeSettlementResult() {
        return {
            big: true,
            blue: false,
            tie: false,
            blueBig: true,
            blueSmall: false,
            even: false,
            odd: true,
            red: true,
            redBig: true,
            redSmall: false,
            small: false,
        };
    }

    renderBetOptions() {
        const { gameState, settlementResult, result, showWinningAnimation, md5 } = this.state;
        return (
            <>
                <RoundResult result={result} md5={md5} />
                <KenoPowerOptions
                    gameState={gameState}
                    settlementResult={settlementResult ?? this.getFakeSettlementResult()}
                    isShowWinningEffect={showWinningAnimation}
                />
            </>
        );
    }

    renderRoundHistory() {
        const sourceTabsValue = {
            blueRed: {
                tabName: this.getGameTranslate("blueRedTabs"),
                tabWinningStreak: this.getWinningStreakByOptions({ options: ["blue", "red"] }),
            },
            bigSmall: {
                tabName: this.getGameTranslate("bigSmallTabs"),
                tabWinningStreak: this.getWinningStreakByOptions({ options: ["big", "small"] }),
            },
            oddEven: {
                tabName: this.getGameTranslate("evenOddTabs"),
                tabWinningStreak: this.getWinningStreakByOptions({ options: ["odd", "even"] }),
            },
            blueBigSmall: {
                tabName: this.getGameTranslate("blueBigSmallTabs"),
                tabWinningStreak: this.getWinningStreakByOptions({ options: ["blueBig", "blueSmall"] }),
            },
            redBigSmall: {
                tabName: this.getGameTranslate("redBigSmallTabs"),
                tabWinningStreak: this.getWinningStreakByOptions({ options: ["redBig", "redSmall"] }),
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
            [Choices.blue]: this.getGameTranslate("blueTextDot"),
            [Choices.red]: this.getGameTranslate("redTextDot"),
            [Choices.tie]: this.getGameTranslate("tieTextDot"),
            [Choices.big]: this.getGameTranslate("bigTextDot"),
            [Choices.small]: this.getGameTranslate("smallTextDot"),
            [Choices.odd]: this.getGameTranslate("oddTextDot"),
            [Choices.even]: this.getGameTranslate("evenTextDot"),
            [Choices.blueBig]: this.getGameTranslate("blueBigTextDot"),
            [Choices.blueSmall]: this.getGameTranslate("blueSmallTextDot"),
            [Choices.redBig]: this.getGameTranslate("redBigTextDot"),
            [Choices.redSmall]: this.getGameTranslate("redSmallTextDot"),
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
