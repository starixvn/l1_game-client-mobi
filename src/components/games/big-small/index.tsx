import React from "react";

import GameBase from "../../shared/game-base";
import { GameBaseProps, GameBaseState, GameState, PopupState } from "../../shared/game-base/type";
import { Result, SettlementResult } from "./big-small";
import BigSmallBetHistory from "./bet-history";
import BigSmallGuide from "../../game-guide/big-small";
import BaseModal from "../../shared/base-modal";
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
            isOpenPopup: { guide: false, betHistory: false },
        };
    }

    renderBetOptions() {
        const { gameState, settlementResult } = this.state;
        const fakeSettlementResult = { big: false, small: false };
        return <BigSmallBetOptions gameState={gameState} settlementResult={settlementResult ?? fakeSettlementResult} />;
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

    renderGuide(popupState: PopupState) {
        return this.renderContentPopup("popupTitleGuide", this.state.isOpenPopup.guide, popupState);
    }

    renderBetHistory(popupState: PopupState) {
        return this.renderContentPopup("popupTitleHistory", this.state.isOpenPopup.betHistory, popupState);
    }

    renderContentPopup(title: string, isOpen: boolean, popupState: PopupState) {
        const component: JSX.Element[] = [<BigSmallGuide></BigSmallGuide>, <BigSmallBetHistory></BigSmallBetHistory>];
        return (
            <BaseModal title={title} isOpen={isOpen} onCloseModal={() => this.updateOpenPopup()}>
                {component[popupState]}
            </BaseModal>
        );
    }
}

export default BigSmall;
