import React from "react";

import FishPrawnCrabGuide from "../../game-guide/fish-prawn-crab";
import AdvanceModal from "../../shared/advance-modal";
import GameBase from "../../shared/game-base";
import { GameBaseProps, GameBaseState, GameState, PopupType } from "../../shared/game-base/type";
import FishPrawnCrabBetHistory from "./bet-history";
import FishPrawnCrabBetOptions from "./bet-options";
import { Result, SettlementResult } from "./fish-prawn-crab";
import FishPrawnCrabResult from "./fish-prawn-crab-result";
import OddComponent from "./odd";
import ScoreboardHistory from "./scoreboard-round-history";
import StatisticComponent from "./statistic";
import { CommonResourceKeys } from "../../../common/resources";

class FishPrawnCrab extends GameBase<GameBaseProps, GameBaseState<Result, SettlementResult>> {
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
        const { gameState, settlementResult, result } = this.state;
        return (
            <FishPrawnCrabBetOptions
                gameState={gameState}
                settlementResult={settlementResult ?? { crab: false, fish: false, gourd: false, prawn: false, rooster: false, stag: false }}
                result={result}
            />
        );
    }

    renderRoundHistory() {
        return <OddComponent />;
    }

    renderStatistic() {
        return <StatisticComponent roundHistory={this.state.roundHistory}></StatisticComponent>;
    }

    renderResult() {
        const { result, settlementResult } = this.state;
        return <FishPrawnCrabResult result={result} settlementResult={settlementResult}></FishPrawnCrabResult>;
    }

    renderBoard() {
        const { gameState, roundHistory } = this.state;
        return <ScoreboardHistory roundHistory={roundHistory} gameState={gameState}></ScoreboardHistory>;
    }

    renderGuide() {
        return (
            <AdvanceModal title={CommonResourceKeys.GUIDE_POPUP_TITLE} isOpen={true} onCloseModal={() => this.closePopup()}>
                <FishPrawnCrabGuide />
            </AdvanceModal>
        );
    }

    renderBetHistory() {
        return (
            <AdvanceModal title={CommonResourceKeys.HISTORY_POPUP_TITLE} isOpen={true} onCloseModal={() => this.closePopup()}>
                <FishPrawnCrabBetHistory />
            </AdvanceModal>
        );
    }
}

export default FishPrawnCrab;
