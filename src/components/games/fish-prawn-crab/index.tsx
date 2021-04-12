import React from "react";

import GameBase from "../../shared/game-base";
import { GameBaseProps, GameBaseState, GameState, PopupType } from "../../shared/game-base/type";
import FishPrawnCrabBetOptions from "./bet-options";
import { Result, SettlementResult } from "./fish-prawn-crab";
import FishPrawnCrabResult from "./fish-prawn-crab-result";
import OddComponent from "./odd";
import ScoreboardHistory from "./scoreboard-round-history";
import StatisticComponent from "./statistic";
import AdvanceModal from "../../shared/advance-modal";
import FishPrawnCrabBetHistory from "./bet-history";
import FishPrawnCrabGuide from "../../game-guide/fish-prawn-crab";

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
            displayPopup: null,
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
        return this.renderContentPopup("popupTitleGuide", this.state.displayPopup === PopupType.Guide);
    }

    renderBetHistory() {
        return this.renderContentPopup("popupTitleHistory", this.state.displayPopup === PopupType.BetHistory);
    }

    renderContentPopup(title: string, isOpen: boolean) {
        const component: JSX.Element[] = [<FishPrawnCrabGuide />, <FishPrawnCrabBetHistory />];
        return (
            <AdvanceModal title={title} isOpen={isOpen} onCloseModal={() => this.closePopup()}>
                {component[this.state.displayPopup]}
            </AdvanceModal>
        );
    }
}

export default FishPrawnCrab;
