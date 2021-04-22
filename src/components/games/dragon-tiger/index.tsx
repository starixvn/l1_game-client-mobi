import React from "react";

import DragonTigerGuide from "../../game-guide/dragon-tiger";
import AdvanceModal from "../../shared/advance-modal";
import GameBase from "../../shared/game-base";
import { GameBaseProps, GameBaseState, GameState } from "../../shared/game-base/type";
import DragonTigerBetHistory from "./bet-history";
import DragonTigerBetOptions from "./bet-options";
import { Result, SettlementResult } from "./dragon-tiger";
import GetElementRound from "./scoreboard-round-history";
import ScoreboardDragon from "../../shared/round-history/scoreboard/dragon";
import DragonTigerRoundHistory from "./round-history";
import { CardsAnimation, DragonTigerResult } from "./animations";
import DragonTigerStatistic from "./statistic";
import { CommonResourceKeys } from "../../../common/resources";

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
        return <CardsAnimation />;
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
