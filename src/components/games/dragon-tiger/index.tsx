import React from "react";

import GameBase from "../../shared/game-base";
import { GameBaseProps, GameBaseState, GameState, PopupType } from "../../shared/game-base/type";
import { Result, SettlementResult } from "./dragon-tiger";
import DragonTigerBetHistory from "./bet-history";
import DragonTigerGuide from "../../game-guide/dragon-tiger";
import AdvanceModal from "../../shared/advance-modal";
import DragonTigerBetOptions from "./bet-options";

class DragonTiger extends GameBase<GameBaseProps, GameBaseState<Result, SettlementResult>> {
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
        const fakeSettlementResult = { dragon: true, tiger: false, tie: false };
        return <DragonTigerBetOptions gameState={gameState} settlementResult={settlementResult ?? fakeSettlementResult} />;
    }

    renderRoundHistory() {
        return <></>;
    }

    renderStatistic() {
        return <></>;
    }

    renderResult() {
        return <></>;
    }

    renderBoard() {
        return <></>;
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
        const component: JSX.Element[] = [<DragonTigerGuide />, <DragonTigerBetHistory />];
        return (
            <AdvanceModal title={title} isOpen={isOpen} onCloseModal={() => this.closePopup()}>
                {component[this.state.displayPopup]}
            </AdvanceModal>
        );
    }
}

export default DragonTiger;
