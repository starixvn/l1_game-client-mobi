import { withTranslation } from "next-i18next";
import { withRouter } from "next/router";
import React from "react";
import RoundSettlementResult from "../../keno/settlement-result";

import GameBase from "../../shared/game-base";
import { GameBaseProps, GameState } from "../../shared/game-base/type";
import ScoreboardDragon from "../../shared/round-history/scoreboard/dragon";
import ScoreboardTab from "../../shared/scoreboard-tab";
import { StatisticFollowPercent } from "../../shared/statistic";
import KenoPowerOptions from "./bet-options";
import { KenoPowerGameState } from "./keno-power";
import { ChoiceForTabActive, Choices, StatisticRuleMapping } from "./keno-power-helper";
import { RoundResult } from "./round-result";

const DisplayChoices = ["big", "small", "odd", "even"];
const DefaultResult = { blue: new Array(20).fill(0), red: new Array(20).fill(0) };

class KenoPower extends GameBase<GameBaseProps, KenoPowerGameState> {
    constructor(props: GameBaseProps) {
        super(props);

        this.state = { ...this.defaultState, result: { red: Array<number>(20), blue: Array<number>(20) }, md5: "" };
    }

    get isShowInlineResult() {
        return true;
    }

    get defaultResult() {
        return DefaultResult;
    }

    get defaultSettlementResult() {
        return {};
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

    renderResultSection() {
        const { result, gameState } = this.state;
        const { settlementResult, showResultInfo } = this.state;

        if (showResultInfo) {
            this.setState({ showMD5ResultKey: true });
            return <RoundSettlementResult title={""} settlementResult={settlementResult} displayChoices={DisplayChoices} />;
        }

        return <RoundResult result={result} gameState={gameState} />;
    }

    renderBetOptions() {
        const { gameState, settlementResult, showWinningAnimation } = this.state;
        return (
            <>
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
                tabHoverValue: this.getGameTranslate("teamBlueRed"),
            },
            bigSmall: {
                tabName: this.getGameTranslate("bigSmallTabs"),
                tabWinningStreak: this.getWinningStreakByOptions({ options: ["big", "small"] }),
                tabHoverValue: this.getGameTranslate("sumBigSmall"),
            },
            oddEven: {
                tabName: this.getGameTranslate("evenOddTabs"),
                tabWinningStreak: this.getWinningStreakByOptions({ options: ["odd", "even"] }),
                tabHoverValue: this.getGameTranslate("sumEvenOdd"),
            },
            blueBigSmall: {
                tabName: this.getGameTranslate("blueBigSmallTabs"),
                tabWinningStreak: this.getWinningStreakByOptions({ options: ["blueBig", "blueSmall"] }),
                tabHoverValue: this.getGameTranslate("teamBlueBigSmall"),
            },
            redBigSmall: {
                tabName: this.getGameTranslate("redBigSmallTabs"),
                tabWinningStreak: this.getWinningStreakByOptions({ options: ["redBig", "redSmall"] }),
                tabHoverValue: this.getGameTranslate("teamRedBigSmall"),
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
        const { result, gameState } = this.state;
        return <RoundResult result={result} gameState={gameState} isCollapse={true} />;
    }

    renderSettlementInfo() {
        return <></>;
    }
}

export default withRouter(withTranslation()(KenoPower));
