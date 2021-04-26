import React from "react";

import { CommonResourceKeys } from "../../../common/resources";
import FishPrawnCrabGuide from "../../game-guide/fish-prawn-crab";
import AdvanceModal from "../../shared/advance-modal";
import GameBase from "../../shared/game-base";
import { GameBaseProps, GameBaseState, GameState, PopupType } from "../../shared/game-base/type";
import PlaceBetModal from "../../shared/place-bet-modal/place-bet-modal";
import ScoreboardBasic from "../../shared/round-history/scoreboard/basic";
import FishPrawnCrabBetHistory from "./bet-history";
import FishPrawnCrabBetOptions from "./bet-options";
import { Result, SettlementResult } from "./fish-prawn-crab";
import FishPrawnCrabResult from "./fish-prawn-crab-result";
import OddComponent from "./odd";
import GetElementRound from "./scoreboard-round-history";
import StatisticComponent from "./statistic";

class FishPrawnCrab extends GameBase<GameBaseProps, GameBaseState<Result, SettlementResult>> {
    constructor(props: GameBaseProps) {
        super(props);

        this.state = {
            signedIn: false,
            gameState: GameState.None,
            remainingTime: 0,
            gameConfigs: { ...this.defaultGameConfig },
            roundHistory: [],
            roundId: 0,
            ownBets: {},
            totalBets: {},
            userStakeLevel: null,
            displayPopup: null,
            isCompactMode: false,
        };
    }

    renderPlaceBet() {
        const DefaultOdds = "single";

        const { displayPopup, selectedBetChoice, roundId, gameConfigs } = this.state;
        const { gameName } = this.props;
        const { odds } = gameConfigs;

        return (
            <PlaceBetModal
                isOpen={displayPopup === PopupType.PlaceBet}
                onCloseModal={() => this.closePopup()}
                onPlaceBet={this.placeBet}
                betChoiceInfo={{
                    betChoice: selectedBetChoice,
                    gameName: gameName,
                    roundId: roundId,
                    odd: odds[DefaultOdds],
                }}
            ></PlaceBetModal>
        );
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
        return <ScoreboardBasic roundHistory={roundHistory} gameState={gameState} getElementRound={GetElementRound}></ScoreboardBasic>;
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
