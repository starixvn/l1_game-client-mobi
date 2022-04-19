import { withTranslation } from "next-i18next";
import { withRouter } from "next/router";
import React from "react";
import { OpenThePlate, BigSmallResultCollapse, ShakeThePlate } from "./animations";
import GatewayGameBase from "../../shared/game-base/gateway-gamebase";
import { GameBaseState, GameState, GatewayGameBaseProps } from "../../shared/game-base/type";
import ChainRoundHistory from "../../shared/round-history/chain";
import ScoreboardDragon from "../../shared/round-history/scoreboard/dragon";
import { StatisticFollowPercent } from "../../shared/statistic";
import BigSmallBetOptions from "./bet-options";
import { Result, SettlementResult } from "./big-small";
import { Choices, StatisticRuleEntries } from "./big-small-helper";
import Styles from "./big-small.module.scss";
import { RenderBigSmallDot, RenderRoundDetail } from "./round-history";

class BigSmall extends GatewayGameBase<GatewayGameBaseProps, GameBaseState<Result, SettlementResult>> {
    constructor(props: GatewayGameBaseProps) {
        super(props);

        this.state = { ...this.defaultState };
    }

    getMainOptions(): string[] {
        return Object.values(Choices);
    }

    handleFinish({ finish }) {
        super.handleFinish({ finish });

        const { totalBets } = this.state;
        const totalBetValues = Object.values(totalBets);
        const balancedBetAmount = Math.min(...[totalBetValues[0] ?? 0, totalBetValues[1] ?? 0]);
        Object.keys(Choices).forEach((choice) => {
            totalBets[choice] = balancedBetAmount;
        });
        this.setState({ totalBets });
    }

    renderBetOptions() {
        const { gameState, settlementResult, betPercentage, showWinningAnimation } = this.state;
        const fakeSettlementResult = { big: false, small: false };
        return (
            <BigSmallBetOptions
                gameState={gameState}
                settlementResult={settlementResult ?? fakeSettlementResult}
                betPercentage={betPercentage}
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
                renderGameDot={RenderBigSmallDot}
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
        const { result } = this.state;
        return <OpenThePlate result={result}></OpenThePlate>;
    }

    renderResultCollapse() {
        const { result, settlementResult } = this.state;
        return <BigSmallResultCollapse result={result} settlementResult={settlementResult} />;
    }

    renderBoard() {
        const translateDotTextMapping = {
            [Choices.big]: this.getGameTranslate("bigTextDot"),
            [Choices.small]: this.getGameTranslate("smallTextDot"),
        };
        return (
            <ScoreboardDragon
                roundHistory={this.state.roundHistory}
                dotDetails={{
                    translateDotTextMapping: translateDotTextMapping,
                    choice: ["big", "small"],
                }}
            />
        );
    }


    get isShowStartRoundAnimation() {
        return this.state.gameState === GameState.BeforeStartRound;
    }
    
    renderStartRoundAnimation() {
        const { durations } = this.props;
        const { roundId } = this.state;
        return (
            <ShakeThePlate
                key={roundId}
                playAnimation={this.timeCounter >= durations.placingBets + durations.beforeStartRound}
                roundId={roundId}
            />
        );
    }
    renderSettlementInfo() {
        const { result, settlementResult } = this.state;
        const { t, gameName } = this.props;

        const totalDiceValue = result.dice1 + result.dice2 + result.dice3;
        const winingOption = settlementResult.big ? "big" : "small";
        const winingOptionTranslateKey = `${gameName.toLowerCase()}:${winingOption}`;

        return (
            <div className={Styles["result-container"]}>
                <div className={Styles["left"]}>
                    <div className={Styles["total-text"]}>{t("common:total")}</div>
                    <div className={`${settlementResult.big ? Styles["total-points-big"] : Styles["total-points-small"]}`}>
                        {totalDiceValue}
                    </div>
                </div>
                <div className={Styles["line"]}></div>
                <div className={`${settlementResult.big ? Styles["result-info-blue"] : Styles["result-info-red"]}`}>
                    {t(winingOptionTranslateKey)}
                </div>
            </div>
        );
    }
}

export default withRouter(withTranslation()(BigSmall));
