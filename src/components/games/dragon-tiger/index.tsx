import { withTranslation } from "next-i18next";
import { withRouter } from "next/router";
import React from "react";

import GatewayGameBase from "../../shared/game-base/gateway-gamebase";
import { GameBaseState, GatewayGameBaseProps } from "../../shared/game-base/type";
import ChainRoundHistory from "../../shared/round-history/chain";
import ScoreboardDragon from "../../shared/round-history/scoreboard/dragon";
import { StatisticFollowPercent } from "../../shared/statistic";
import { DragonTigerResult, DragonTigerResultCollapse } from "./animations";
import DragonTigerBetOptions from "./bet-options";
import { Result, SettlementResult } from "./dragon-tiger";
import { Choices, StatisticRuleEntries } from "./dragon-tiger-helper";
import Styles from "./dragon-tiger.module.scss";
import { RenderDragonTigerDot, RenderRoundDetail } from "./round-history";
import GetScoreboardDotDetails from "./scoreboard-round-history";

class DragonTiger extends GatewayGameBase<GatewayGameBaseProps, GameBaseState<Result, SettlementResult>> {
    constructor(props: GatewayGameBaseProps) {
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
        return (
            <DragonTigerResult
                result={this.state.result ?? { dragon: { card: 1, type: 2 }, tiger: { card: 5, type: 1 } }}
                settlementResult={this.state.settlementResult ?? { dragon: false, tiger: true, tie: false }}
            />
        );
    }

    renderResultCollapse() {
        return (
            <DragonTigerResultCollapse
                result={this.state.result ?? { dragon: { card: 1, type: 2 }, tiger: { card: 5, type: 1 } }}
                settlementResult={this.state.settlementResult ?? { dragon: false, tiger: true, tie: false }}
            />
        );
    }

    renderBoard() {
        const translateDotTextMapping = {
            [Choices.tie]: this.getGameTranslate("tieTextDot"),
            [Choices.tiger]: this.getGameTranslate("tigerTextDot"),
            [Choices.dragon]: this.getGameTranslate("dragonTextDot"),
        };
        return (
            <ScoreboardDragon
                roundHistory={this.state.roundHistory}
                getDotDetails={GetScoreboardDotDetails}
                translateDotTextMapping={translateDotTextMapping}
            />
        );
    }

    get winningAnimationWaitingTimeInSecond() {
        return this.props.durations.resultAnimation * 1000;
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

        return <></>;
    }

    renderSettlementInfo() {
        const { settlementResult } = this.state;

        return <div className={Styles["result-container"]}>{this.renderSettlementResult(settlementResult)}</div>;
    }
}

export default withRouter(withTranslation()(DragonTiger));
