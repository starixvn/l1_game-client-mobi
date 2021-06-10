import { withTranslation } from "next-i18next";
import { withRouter } from "next/router";
import React from "react";

import { CommonResourceKeys, GameResourceKeys } from "../../../common/resources";
import AdvanceModal from "../../shared/advance-modal";
import GameBase from "../../shared/game-base";
import { GameBaseProps, GameBaseState } from "../../shared/game-base/type";
import ChainRoundHistory from "../../shared/round-history/chain";
import ScoreboardDragon from "../../shared/round-history/scoreboard/dragon";
import { StatisticFollowPercent } from "../../shared/statistic";
import BigSmallBetHistory from "./bet-history";
import BigSmallBetOptions from "./bet-options";
import { Result, SettlementResult } from "./big-small";
import { Choices, StatisticRuleEntries } from "./big-small-helper";
import BigSmallResult, { BigSmallResultCollapse } from "./big-small-result";
import Styles from "./big-small.module.scss";
import { RenderBigSmallDot, RenderRoundDetail } from "./round-history";
import GetElementRound from "./scoreboard-round-history";
import GameGuides from "../../shared/game-guide";

class BigSmall extends GameBase<GameBaseProps, GameBaseState<Result, SettlementResult>> {
    constructor(props: GameBaseProps) {
        super(props);

        this.state = { ...this.defaultState };
    }

    getMainOptions(): string[] {
        return Object.values(Choices);
    }

    handleFinish({ finish }) {
        super.handleFinish({ finish });

        const { totalBets } = this.state;
        const balancedBetAmount = Math.min(...Object.values(totalBets));
        Object.keys(totalBets).forEach((choice) => {
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
        const { result, roundId } = this.state;
        return <BigSmallResult result={result} roundId={roundId}></BigSmallResult>;
    }

    renderResultCollapse() {
        const { result, settlementResult, roundId } = this.state;
        return <BigSmallResultCollapse result={result} settlementResult={settlementResult} roundId={roundId} />;
    }

    renderBoard() {
        const { roundHistory } = this.state;
        return <ScoreboardDragon roundHistory={roundHistory} getElementRound={GetElementRound} translate={this.props.t} />;
    }

    get winningAnimationWaitingTimeInSecond() {
        const { id, durations } = this.props;
        const duration = id === 4 ? durations.resultAnimation + durations.balancingBet : durations.showResult + durations.balancingBet;

        return duration * 1000;
    }

    renderGuide() {
        return (
            <AdvanceModal isOpen={true} onCloseModal={this.closePopup} isAddScrollBody={true}>
                <GameGuides gameId={this.props.id} language={this.context.session.language} theme={this.props.theme}></GameGuides>
            </AdvanceModal>
        );
    }

    renderBetHistory() {
        const gameName = this.props.t(`${this.props.gameName.toLowerCase()}:${GameResourceKeys.GAME_NAME}`);
        return (
            <AdvanceModal
                title={CommonResourceKeys.HISTORY_POPUP_TITLE}
                gameName={`(${gameName})`}
                isOpen={true}
                onCloseModal={this.closePopup}
                isAddScrollBody={true}
                gameId={this.props.id}
            >
                <BigSmallBetHistory />
            </AdvanceModal>
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
