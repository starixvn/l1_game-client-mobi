import React from "react";

import { CommonResourceKeys } from "../../../common/resources";
import BigSmallGuide from "../../game-guide/big-small";
import AdvanceModal from "../../shared/advance-modal";
import GameBase from "../../shared/game-base";
import { GameBaseProps, GameBaseState, GameState } from "../../shared/game-base/type";
import ScoreboardDragon from "../../shared/round-history/scoreboard/dragon";
import BigSmallBetHistory from "./bet-history";
import BigSmallBetOptions from "./bet-options";
import { Result, SettlementResult } from "./big-small";
import BigSmallResult from "./big-small-result";
import BigSmallRoundHistory from "./round-history";
import GetElementRound from "./scoreboard-round-history";
import BigSmallStatistic from "./statistic";

class BigSmall extends GameBase<GameBaseProps, GameBaseState<Result, SettlementResult>> {
    constructor(props: GameBaseProps) {
        super(props);

        this.state = { ...this.defaultState };
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
        const { result, playResultAnimation } = this.state;
        return <BigSmallResult result={result} hasAnimation={playResultAnimation}></BigSmallResult>;
    }

    renderBoard() {
        const { gameState, roundHistory } = this.state;
        return <ScoreboardDragon roundHistory={roundHistory} gameState={gameState} getElementRound={GetElementRound} />;
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
