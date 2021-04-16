import React from "react";

import DragonTigerGuide from "../../game-guide/dragon-tiger";
import AdvanceModal from "../../shared/advance-modal";
import GameBase from "../../shared/game-base";
import { GameBaseProps, GameBaseState, GameState, PopupType } from "../../shared/game-base/type";
import DragonTigerBetHistory from "./bet-history";
import DragonTigerBetOptions from "./bet-options";
import { Result, SettlementResult } from "./dragon-tiger";
import ScoreboardHistory from "./scoreboard-round-history";
import DragonTigerRoundHistory from "./round-history";
import DragonTigerResult from "./dragon-tiger-result";
import DragonTigerStatistic from "./statistic";

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
            userStakeLevel: null,
            displayPopup: null,
            isCompactMode: false,
        };
    }

    renderBetOptions() {
        const { gameState, settlementResult } = this.state;
        const fakeSettlementResult = { dragon: true, tiger: false, tie: false };
        return <DragonTigerBetOptions gameState={gameState} settlementResult={settlementResult ?? fakeSettlementResult} />;
    }

    renderRoundHistory() {
        const { gameState, roundHistory } = this.state;
        return <DragonTigerRoundHistory roundHistory={roundHistory} gameState={gameState} />;
    }

    renderStatistic() {
        return <DragonTigerStatistic roundHistory={this.state.roundHistory} />;
    }

    renderResult() {
        const { result, settlementResult } = this.state;
        return <DragonTigerResult result={result} settlementResult={settlementResult} />;
    }

    renderBoard() {
        const { gameState, roundHistory } = this.state;
        return <ScoreboardHistory roundHistory={roundHistory} gameState={gameState} />;
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
