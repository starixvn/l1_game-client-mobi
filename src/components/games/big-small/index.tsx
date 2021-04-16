import React from "react";

import BigSmallGuide from "../../game-guide/big-small";
import AdvanceModal from "../../shared/advance-modal";
import GameBase from "../../shared/game-base";
import { GameBaseProps, GameBaseState, GameState, PopupType } from "../../shared/game-base/type";
import BigSmallBetHistory from "./bet-history";
import BigSmallBetOptions from "./bet-options";
import { Result, SettlementResult } from "./big-small";
import BigSmallResult from "./big-small-result";
import BigSmallRoundHistory from "./round-history";
import ScoreboardHistory from "./scoreboard-round-history";
import BigSmallStatistic from "./statistic";
import { CommonResourceKeys } from "../../../common/resources";

class BigSmall extends GameBase<GameBaseProps, GameBaseState<Result, SettlementResult>> {
    constructor(props: GameBaseProps) {
        super(props);

        this.state = {
            signedIn: false,
            gameState: GameState.None,
            remainingTime: 0,
            gameConfigs: null,
            roundHistory: [],
            roundId: 0,
            ownBets: {},
            totalBets: {},
            userStakeLevel: null,
            displayPopup: null,
            betPercentage: {},
            isCompactMode: false,
        };
    }

    renderBetOptions() {
        const { gameState, settlementResult, betPercentage } = this.state;
        const fakeSettlementResult = { big: false, small: false };
        return (
            <BigSmallBetOptions
                gameState={gameState}
                settlementResult={settlementResult ?? fakeSettlementResult}
                betPercentage={betPercentage}
            />
        );
    }

    renderRoundHistory() {
        const { gameState, roundHistory } = this.state;
        return <BigSmallRoundHistory roundHistory={roundHistory} gameState={gameState} />;
    }

    renderStatistic() {
        return <BigSmallStatistic roundHistory={this.state.roundHistory}></BigSmallStatistic>;
    }

    renderResult() {
        const { result, settlementResult } = this.state;
        return <BigSmallResult result={result} settlementResult={settlementResult}></BigSmallResult>;
    }

    renderBoard() {
        const { gameState, roundHistory } = this.state;
        return <ScoreboardHistory roundHistory={roundHistory} gameState={gameState}></ScoreboardHistory>;
    }

    get isShowStartRoundAnimation() {
        return this.state.gameState === GameState.BeforeStartRound;
    }

    renderGuide() {
        return (
            <AdvanceModal title={CommonResourceKeys.GUIDE_POPUP_TITLE} isOpen={true} onCloseModal={() => this.closePopup()}>
                <BigSmallGuide />
            </AdvanceModal>
        );
    }

    renderBetHistory() {
        return (
            <AdvanceModal title={CommonResourceKeys.HISTORY_POPUP_TITLE} isOpen={true} onCloseModal={() => this.closePopup()}>
                <BigSmallBetHistory />
            </AdvanceModal>
        );
    }
}

export default BigSmall;
