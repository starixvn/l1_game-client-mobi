import React from "react";

import { CommonResourceKeys } from "../../../common/resources";
import DragonTigerGuide from "../../game-guide/dragon-tiger";
import AdvanceModal from "../../shared/advance-modal";
import GameBase from "../../shared/game-base";
import { GameBaseProps, GameBaseState, GameState } from "../../shared/game-base/type";
import ScoreboardDragon from "../../shared/round-history/scoreboard/dragon";
import { CardsAnimation, DragonTigerResult } from "./animations";
import DragonTigerBetHistory from "./bet-history";
import DragonTigerBetOptions from "./bet-options";
import { Result, SettlementResult } from "./dragon-tiger";
import { RenderRoundDetail, RenderDragonTigerDot } from "./round-history";
import GetElementRound from "./scoreboard-round-history";
import StatisticRuleEntries from "./statistic";
import { StatisticFollowPercent } from "../../shared/statistic";
import ChainRoundHistory from "../../shared/round-history/chain";

class DragonTiger extends GameBase<GameBaseProps, GameBaseState<Result, SettlementResult>> {
    constructor(props: GameBaseProps) {
        super(props);

        this.state = { ...this.defaultState };
    }

    renderBetOptions() {
        const { gameState, settlementResult } = this.state;
        const fakeSettlementResult = { dragon: true, tiger: false, tie: false };
        return <DragonTigerBetOptions gameState={gameState} settlementResult={settlementResult ?? fakeSettlementResult} />;
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

    renderBoard() {
        const { gameState, roundHistory } = this.state;
        return <ScoreboardDragon roundHistory={roundHistory} gameState={gameState} getElementRound={GetElementRound} />;
    }

    get isShowStartRoundAnimation() {
        return (
            this.state.gameState === GameState.BeforeStartRound ||
            this.state.gameState === GameState.InRound ||
            this.state.gameState === GameState.LockingBet
        );
    }

    renderStartRoundAnimation() {
        const { durations } = this.props;

        return <CardsAnimation playAnimation={this.timeCounter === durations.placingBets + durations.beforeStartRound} />;
    }

    renderGuide() {
        return (
            <AdvanceModal title={CommonResourceKeys.GUIDE_POPUP_TITLE} isOpen={true} onCloseModal={() => this.closePopup()}>
                <DragonTigerGuide />
            </AdvanceModal>
        );
    }

    renderBetHistory() {
        return (
            <AdvanceModal title={CommonResourceKeys.HISTORY_POPUP_TITLE} isOpen={true} onCloseModal={() => this.closePopup()}>
                <DragonTigerBetHistory />
            </AdvanceModal>
        );
    }
}

export default DragonTiger;
