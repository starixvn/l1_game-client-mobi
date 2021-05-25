import React from "react";
import { withTranslation } from "react-i18next";

import { CommonResourceKeys, GameResourceKeys } from "../../../common/resources";
import FishPrawnCrabGuide from "../../game-guide/fish-prawn-crab";
import AdvanceModal from "../../shared/advance-modal";
import GameBase from "../../shared/game-base";
import { GameBaseProps, GameBaseState } from "../../shared/game-base/type";
import ScoreboardRoundHistory from "../../shared/round-history/scoreboard";
import ScoreboardBasic from "../../shared/round-history/scoreboard/basic";
import FishPrawnCrabBetHistory from "./bet-history";
import FishPrawnCrabBetOptions from "./bet-options";
import { Result, SettlementResult } from "./fish-prawn-crab";
import FishPrawnCrabResult from "./fish-prawn-crab-result";
import OddComponent from "./odd";
import GetElementRound, { GetElementRoundOfCompactMode } from "./scoreboard-round-history";
import StatisticComponent from "./statistic";
import { withRouter } from "next/router";

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

const DefaultOdds = "single";

class FishPrawnCrab extends GameBase<GameBaseProps, GameBaseState<Result, SettlementResult>> {
    constructor(props: GameBaseProps) {
        super(props);

        this.state = { ...this.defaultState };
    }

    getMainOptions(): string[] {
        return Object.keys(choicesMapper);
    }

    getOddsByChoice(choice: string) {
        const { gameConfigs } = this.state;
        const odds = gameConfigs.odds;

        return odds[DefaultOdds];
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
        const gameName = this.props.t(`${this.props.gameName.toLowerCase()}:${GameResourceKeys.GAME_NAME}`);
        return (
            <AdvanceModal
                title={CommonResourceKeys.GUIDE_POPUP_TITLE}
                gameName={`(${gameName})`}
                isOpen={true}
                onCloseModal={() => this.closePopup()}
            >
                <FishPrawnCrabGuide />
            </AdvanceModal>
        );
    }

    renderBetHistory() {
        const gameName = this.props.t(`${this.props.gameName.toLowerCase()}:${GameResourceKeys.GAME_NAME}`);
        return (
            <AdvanceModal
                title={CommonResourceKeys.HISTORY_POPUP_TITLE}
                gameName={`(${gameName})`}
                isOpen={true}
                onCloseModal={() => this.closePopup()}
            >
                <FishPrawnCrabBetHistory />
            </AdvanceModal>
        );
    }
}

export default withRouter(withTranslation()(FishPrawnCrab));
