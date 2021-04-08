import React from "react";

import GameBase from "../../shared/game-base";
import { GameBaseProps, GameBaseState, GameState, PopupState } from "../../shared/game-base/type";
import FishPrawnCrabBetOptions from "./bet-options";
import { Result, SettlementResult } from "./fish-prawn-crab";
import FishPrawnCrabResult from "./fish-prawn-crab-result";
import OddComponent from "./odd";
import ScoreboardHistory from "./scoreboard-round-history";
import StatisticComponent from "./statistic";
import BaseModal from "../../shared/base-modal";
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
            isOpenPopup: { guide: false, betHistory: false },
        };
    }

    renderBetOptions() {
        const { gameState, settlementResult } = this.state;
        return (
            <FishPrawnCrabBetOptions
                gameState={gameState}
                settlementResult={settlementResult ?? { crab: false, fish: false, gourd: false, prawn: false, rooster: false, stag: false }}
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

    renderGuide(popupState: PopupState) {
        return this.renderContentPopup("popupTitleGuide", this.state.isOpenPopup.guide, popupState);
    }

    renderBetHistory(popupState: PopupState) {
        return this.renderContentPopup("popupTitleHistory", this.state.isOpenPopup.betHistory, popupState);
    }

    renderContentPopup(title: string, isOpen: boolean, popupState: PopupState) {
        const component: JSX.Element[] = [<FishPrawnCrabGuide></FishPrawnCrabGuide>, <FishPrawnCrabBetHistory></FishPrawnCrabBetHistory>];
        return (
            <BaseModal title={title} isOpen={isOpen} onCloseModal={() => this.updateOpenPopup()}>
                {component[popupState]}
            </BaseModal>
        );
    }
}

export default FishPrawnCrab;
