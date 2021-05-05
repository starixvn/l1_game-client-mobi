import React from "react";

import { CommonResourceKeys } from "../../../common/resources";
import FishPrawnCrabGuide from "../../game-guide/fish-prawn-crab";
import AdvanceModal from "../../shared/advance-modal";
import GameBase from "../../shared/game-base";
import { GameBaseProps, GameBaseState, PopupType } from "../../shared/game-base/type";
import PlaceBetModal from "../../shared/place-bet-modal/place-bet-modal";
import ScoreboardBasic from "../../shared/round-history/scoreboard/basic";
import FishPrawnCrabBetHistory from "./bet-history";
import FishPrawnCrabBetOptions from "./bet-options";
import { Result, SettlementResult } from "./fish-prawn-crab";
import FishPrawnCrabResult from "./fish-prawn-crab-result";
import OddComponent from "./odd";
import GetElementRound, { GetElementRoundOfCompactMode } from "./scoreboard-round-history";
import StatisticComponent from "./statistic";
import ScoreboardRoundHistory from "../../shared/round-history/scoreboard";

export const choicesMapper = { stag: 0, gourd: 1, rooster: 2, fish: 3, crab: 4, prawn: 5 };
export const OddNames = {
    single: "single",
    double: "double",
    triple: "triple",
};
export enum ResultBet {
    stag,
    gourd,
    rooster,
    fish,
    crab,
    prawn,
}

class FishPrawnCrab extends GameBase<GameBaseProps, GameBaseState<Result, SettlementResult>> {
    constructor(props: GameBaseProps) {
        super(props);

        this.state = { ...this.defaultState };
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
        return this.state.isCompactMode ? <ScoreboardRoundHistory>{this.renderBoard()}</ScoreboardRoundHistory> : <OddComponent />;
    }

    renderStatistic() {
        return <StatisticComponent roundHistory={this.state.roundHistory.slice(0, 30)}></StatisticComponent>;
    }

    renderResult() {
        const { result } = this.state;
        return <FishPrawnCrabResult result={result}></FishPrawnCrabResult>;
    }

    renderBoard() {
        const { gameState, roundHistory } = this.state;
        return (
            <ScoreboardBasic
                roundHistory={roundHistory.slice(0, 30)}
                gameState={gameState}
                getElementRound={this.state.isCompactMode ? GetElementRoundOfCompactMode : GetElementRound}
            ></ScoreboardBasic>
        );
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
