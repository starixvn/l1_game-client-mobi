import React from "react";

import SeDieGuide from "../../game-guide/se-die";
import AdvanceModal from "../../shared/advance-modal";
import BaseDialog from "../../shared/base-dialog";
import GameBase from "../../shared/game-base";
import { GameBaseProps, GameBaseState, GameState, PopupType } from "../../shared/game-base/type";
import Rebet from "../../shared/rebet";
import { OpenThePlate, ShakeThePlate } from "./animations";
import SeDieBetHistory from "./bet-history";
import SeDieBetOptions from "./bet-options";
import SeDieRoundHistory from "./round-history";
import ScoreboardHistory from "./scoreboard-round-history";
import { Result, SettlementResult } from "./sedie";
import SeDiceStatistic from "./statistic";

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
            displayPopup: null,
        };
    }

    renderBetOptions() {
        const { gameState, settlementResult } = this.state;
        const fakeSettlementResult = { even: false, odd: false, red2: false, red3: false, red4: false, white3: false, white4: false };
        return <SeDieBetOptions gameState={gameState} settlementResult={settlementResult ?? fakeSettlementResult} />;
    }

    renderRoundHistory() {
        const { gameState, roundHistory } = this.state;
        return <SeDieRoundHistory roundHistory={roundHistory} gameState={gameState}></SeDieRoundHistory>;
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

    renderGuide() {
        return this.renderContentPopup("popupTitleGuide", this.state.displayPopup === PopupType.Guide);
    }

    renderBetHistory() {
        return this.renderContentPopup("popupTitleHistory", this.state.displayPopup === PopupType.BetHistory);
    }

    renderReBet() {
        return (
            <BaseDialog size={"md"} isOpen={this.state.displayPopup === PopupType.Rebet} onCloseModal={() => this.closePopup()}>
                <Rebet gameId={this.props.id} onCloseModal={() => this.closePopup()} />
            </BaseDialog>
        );
    }

    renderContentPopup(title: string, isOpen: boolean) {
        const component: JSX.Element[] = [<SeDieGuide />, <SeDieBetHistory />];
        return (
            <AdvanceModal title={title} isOpen={isOpen} onCloseModal={() => this.closePopup()}>
                {component[this.state.displayPopup]}
            </AdvanceModal>
        );
    }
}

export default SeDie;
