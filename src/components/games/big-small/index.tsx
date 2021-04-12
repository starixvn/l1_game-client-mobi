import React from "react";

import GameBase from "../../shared/game-base";
import { GameBaseProps, GameBaseState, GameState, PopupType } from "../../shared/game-base/type";
import { Result, SettlementResult } from "./big-small";
import BigSmallBetHistory from "./bet-history";
import BigSmallGuide from "../../game-guide/big-small";
import AdvanceModal from "../../shared/advance-modal";
import BigSmallBetOptions from "./bet-options";
import MiniRoundHistory from "./mini-round-history";
import BigSmallStatistic from "./statistic";
import ScoreboardHistory from "./scoreboard-round-history";

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
            displayPopup: null,
            betPercentage: {},
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
        return <MiniRoundHistory roundHistory={roundHistory} gameState={gameState}></MiniRoundHistory>;
    }

    renderStatistic() {
        return <BigSmallStatistic roundHistory={this.state.roundHistory}></BigSmallStatistic>;
    }

    renderResult() {
        return <></>;
    }

    renderBoard() {
        const { gameState, roundHistory } = this.state;
        return <ScoreboardHistory roundHistory={roundHistory} gameState={gameState}></ScoreboardHistory>;
    }

    get isShowStartRoundAnimation() {
        return this.state.gameState === GameState.BeforeStartRound;
    }

    renderGuide() {
        return this.renderContentPopup("popupTitleGuide", this.state.displayPopup === PopupType.Guide);
    }

    renderBetHistory() {
        return this.renderContentPopup("popupTitleHistory", this.state.displayPopup === PopupType.BetHistory);
    }

    renderReBet() {
        return <></>;
    }

    renderContentPopup(title: string, isOpen: boolean) {
        const component: JSX.Element[] = [<BigSmallGuide />, <BigSmallBetHistory />];
        return (
            <AdvanceModal title={title} isOpen={isOpen} onCloseModal={() => this.closePopup()}>
                {component[this.state.displayPopup]}
            </AdvanceModal>
        );
    }
}

export default BigSmall;
