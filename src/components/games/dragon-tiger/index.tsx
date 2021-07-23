import { withTranslation } from "next-i18next";
import { withRouter } from "next/router";
import React from "react";
import GameBase from "../../shared/game-base";
import { GameBaseProps, GameBaseState, GameState } from "../../shared/game-base/type";
import ChainRoundHistory from "../../shared/round-history/chain";
import ScoreboardDragon from "../../shared/round-history/scoreboard/dragon";
import { StatisticFollowPercent } from "../../shared/statistic";
import { CardsAnimation, DragonTigerResult, DragonTigerResultCollapse } from "./animations";
import DragonTigerBetOptions from "./bet-options";
import { Result, SettlementResult } from "./dragon-tiger";
import { Choices, StatisticRuleEntries } from "./dragon-tiger-helper";
import Styles from "./dragon-tiger.module.scss";
import { RenderDragonTigerDot, RenderRoundDetail } from "./round-history";
import GetElementRound from "./scoreboard-round-history";

class DragonTiger extends GameBase<GameBaseProps, GameBaseState<Result, SettlementResult>> {
    constructor(props: GameBaseProps) {
        super(props);

        this.state = { ...this.defaultState };
    }

    getMainOptions(): string[] {
        return [Choices.dragon, Choices.tiger, Choices.tie];
    }

    renderBetOptions() {
        const { gameState, settlementResult, showWinningAnimation } = this.state;
        const fakeSettlementResult = { dragon: true, tiger: false, tie: false };
        return (
            <DragonTigerBetOptions
                gameState={gameState}
                settlementResult={settlementResult ?? fakeSettlementResult}
                isShowWinningEffect={showWinningAnimation}
            />
        );
    }

    renderRoundHistory() {
        const { gameState, roundHistory } = this.state;
        return (
            <ChainRoundHistory
                roundHistory={roundHistory}
                gameState={gameState}
                renderGameDot={RenderDragonTigerDot}
                renderRoundDetail={RenderRoundDetail}
            ></ChainRoundHistory>
        );
    }

    renderStatistic() {
        return (
            <StatisticFollowPercent
                roundHistory={this.state.roundHistory}
                statisticRuleEntries={StatisticRuleEntries}
            ></StatisticFollowPercent>
        );
    }

    renderResult() {
        const { result, settlementResult } = this.state;
        return <DragonTigerResult result={result} settlementResult={settlementResult} />;
    }

    renderResultCollapse() {
        const { result, settlementResult } = this.state;
        return <DragonTigerResultCollapse result={result} settlementResult={settlementResult} />;
    }

    renderBoard() {
        const { roundHistory } = this.state;
        const gameName = this.props.gameName.toLowerCase();
        const translateDotTextMapping = {
            [Choices.tie]: this.props.t(`${gameName}:tieTextDot`),
            [Choices.tiger]: this.props.t(`${gameName}:tigerTextDot`),
            [Choices.dragon]: this.props.t(`${gameName}:dragonTextDot`),
        };
        return (
            <ScoreboardDragon
                roundHistory={roundHistory}
                getElementRound={GetElementRound}
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

    get winningAnimationWaitingTimeInSecond() {
        return this.props.durations.resultAnimation * 1000;
    }

    renderStartRoundAnimation() {
        const { durations } = this.props;

        return <CardsAnimation playAnimation={this.timeCounter >= durations.placingBets + durations.beforeStartRound} />;
    }

    renderSettlementResult(settlementResult) {
        if (settlementResult.tie) {
            return <div className={Styles["result-info-green"]}>{this.getGameTranslate("tie")}</div>;
        }

        if (settlementResult.dragon) {
            return <div className={Styles["result-info-orange"]}>{this.getGameTranslate("dragonWin")}</div>;
        }

        if (settlementResult.tiger) {
            return <div className={Styles["result-info-red"]}>{this.getGameTranslate("tigerWin")}</div>;
        }
    }

    renderSettlementInfo() {
        const { settlementResult } = this.state;

        return <div className={Styles["result-container"]}>{this.renderSettlementResult(settlementResult)}</div>;
    }
}

export default withRouter(withTranslation()(DragonTiger));
