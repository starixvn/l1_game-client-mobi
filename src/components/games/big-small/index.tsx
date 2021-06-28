import { withTranslation } from "next-i18next";
import React from "react";

import { CommonResourceKeys, GameResourceKeys } from "../../../common/resources";
import BigSmallGuide from "../../game-guide/big-small";
import AdvanceModal from "../../shared/advance-modal";
import GameBase from "../../shared/game-base";
import { GameBaseProps, GameBaseState, GameState } from "../../shared/game-base/type";
import ChainRoundHistory from "../../shared/round-history/chain";
import ScoreboardDragon from "../../shared/round-history/scoreboard/dragon";
import { StatisticFollowPercent } from "../../shared/statistic";
import BigSmallBetHistory from "./bet-history";
import BigSmallBetOptions from "./bet-options";
import { Result, SettlementResult } from "./big-small";
import BigSmallResult, { BigSmallResultCollapse } from "./big-small-result";
import { RenderBigSmallDot, RenderRoundDetail } from "./round-history";
import GetElementRound from "./scoreboard-round-history";
import StatisticRuleEntries from "./statistic";
import { withRouter } from "next/router";
import { Choices } from "./big-small-helper";
import Styles from "./big-small.module.scss";

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
        const { result } = this.state;
        return <BigSmallResult result={result}></BigSmallResult>;
    }

    renderResultCollapse() {
        const { result, settlementResult } = this.state;
        return <BigSmallResultCollapse result={result} settlementResult={settlementResult} />;
    }

    renderBoard() {
        const { roundHistory } = this.state;
        return <ScoreboardDragon roundHistory={roundHistory} getElementRound={GetElementRound} translate={this.props.t} />;
    }

    get isShowStartRoundAnimation() {
        return this.state.gameState === GameState.BeforeStartRound;
    }

    get winningAnimationWaitingTimeInSecond() {
        const { id, durations } = this.props;
        const duration = id === 4 ? durations.resultAnimation + durations.balancingBet : durations.showResult + durations.balancingBet;

        return duration * 1000;
    }

    renderGuide() {
        const gameName = this.props.t(`${this.props.gameName.toLowerCase()}:${GameResourceKeys.GAME_NAME}`);
        return (
            <AdvanceModal
                title={CommonResourceKeys.GUIDE_POPUP_TITLE}
                gameName={`(${gameName})`}
                isOpen={true}
                onCloseModal={() => this.closePopup()}
                isAddScrollBody={true}
            >
                <BigSmallGuide />
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
                onCloseModal={() => this.closePopup()}
                isAddScrollBody={true}
            >
                <BigSmallBetHistory />
            </AdvanceModal>
        );
    }

    renderResultInfo() {
        const { result } = this.state;
        // const result = { dice1: 1, dice2: 1, dice3: 1 };
        return (
            <div className={Styles["result-info"]}>
                {Object.values(result).map((value, index) => (
                    <div key={index} className={Styles["dice"]}>
                        <img src={`/static/images/bigsmall-dice-${value}.png`} className={Styles["dice"]} alt="dice" />
                    </div>
                ))}
            </div>
        );
    }

    renderSettlementInfo() {
        const { result, settlementResult } = this.state;
        const { t, gameName } = this.props;
        // const result = { dice1: 1, dice2: 1, dice3: 1 };
        // const settlementResult = { big: true, small: false };

        const totalDiceValue = result.dice1 + result.dice2 + result.dice3;
        const winingOption = settlementResult.big ? "big" : "small";
        const winingOptionTranslateKey = `${gameName.toLowerCase()}:${winingOption}`;

        return (
            <div
                className={`${settlementResult.big ? Styles["settlement-info-blue"] : Styles["settlement-info-red"]}`}
            >{`${totalDiceValue} - ${t(winingOptionTranslateKey)}`}</div>
        );
    }
}

export default withRouter(withTranslation()(BigSmall));
