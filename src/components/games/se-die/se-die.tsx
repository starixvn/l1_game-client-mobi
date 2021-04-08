import React from "react";

import BaseModal from "../../shared/base-modal";
import GameBase from "../../shared/game-base";
import { GameBaseProps, GameBaseState, GameState, PopupState } from "../../shared/game-base/type";
import { OpenThePlate, ShakeThePlate } from "./animations";
import SeDieBetOptions from "./bet-options";
import MiniRoundHistory from "./mini-round-history";
import ScoreboardHistory from "./scoreboard-round-history";
import { Result, SettlementResult } from "./sedie";
import SeDiceStatistic from "./statistic";
import SeDieBetHistory from "./bet-history";
import SeDieGuide from "../../game-guide/se-die";

class SeDie extends GameBase<GameBaseProps, GameBaseState<Result, SettlementResult>> {
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
        const fakeSettlementResult = { even: false, odd: false, red2: false, red3: false, red4: false, white3: false, white4: false };
        return <SeDieBetOptions gameState={gameState} settlementResult={settlementResult ?? fakeSettlementResult} />;
    }

    renderRoundHistory() {
        const { gameState, roundHistory } = this.state;
        return <MiniRoundHistory roundHistory={roundHistory} gameState={gameState}></MiniRoundHistory>;
    }

    renderStatistic() {
        return <SeDiceStatistic roundHistory={this.state.roundHistory}></SeDiceStatistic>;
    }

    renderBoard() {
        const { gameState, roundHistory } = this.state;
        return <ScoreboardHistory roundHistory={roundHistory} gameState={gameState}></ScoreboardHistory>;
    }

    get isShowStartRoundAnimation() {
        return this.state.gameState === GameState.BeforeStartRound;
    }

    renderStartRoundAnimation() {
        return <ShakeThePlate />;
    }

    renderResult() {
        const { result } = this.state;
        return <OpenThePlate result={result}></OpenThePlate>;
    }

    renderGuide(popupState: PopupState) {
        return this.renderContentPopup("popupTitleGuide", this.state.isOpenPopup.guide, popupState);
    }

    renderBetHistory(popupState: PopupState) {
        return this.renderContentPopup("popupTitleHistory", this.state.isOpenPopup.betHistory, popupState);
    }

    renderContentPopup(title: string, isOpen: boolean, popupState: PopupState) {
        const component: JSX.Element[] = [<SeDieGuide></SeDieGuide>, <SeDieBetHistory></SeDieBetHistory>];
        return (
            <BaseModal title={title} isOpen={isOpen} onCloseModal={() => this.updateOpenPopup()}>
                {component[popupState]}
            </BaseModal>
        );
    }
}

export default SeDie;
