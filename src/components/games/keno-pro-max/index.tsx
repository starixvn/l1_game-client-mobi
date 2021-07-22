import { withTranslation } from "next-i18next";
import { withRouter } from "next/router";
import React from "react";

import { CommonResourceKeys, GameResourceKeys } from "../../../common/resources";
import AdvanceModal from "../../shared/advance-modal";
import GameBase from "../../shared/game-base";
import { GameBaseProps, GameBaseState, GameState } from "../../shared/game-base/type";
import ChainRoundHistory from "../../shared/round-history/chain";
import ScoreboardDragon from "../../shared/round-history/scoreboard/dragon";
import { KenoProMaxResult, KenoProMaxResultCollapse } from "./animations";
import KenoProMaxBetHistory from "./bet-history";
import KenoProMaxBetOptions from "./bet-options";
import { RenderRoundDetail, RenderKenoProMaxDot } from "./round-history";
import GetElementRound, { CheckCondition } from "./scoreboard-round-history";
import { Result, SettlementResult } from "./keno-pro-max";
import KenoProMaxStatistic from "./statistic";

class KenoProMax extends GameBase<GameBaseProps, GameBaseState<Result, SettlementResult>> {
    constructor(props: GameBaseProps) {
        super(props);

        this.state = { ...this.defaultState };
    }

    getMainOptions(): string[] {
        return ["big", "small", "odd", "even", "earth", "fire", "gold", "water", "wood"];
    }

    renderBetOptions() {
        const { gameState, settlementResult, showWinningAnimation } = this.state;
        const fakeSettlementResult = {
            big: true,
            earth: false,
            even: true,
            fire: false,
            gold: false,
            odd: false,
            small: false,
            water: true,
            wood: false,
        };
        return (
            <KenoProMaxBetOptions
                gameState={gameState}
                settlementResult={settlementResult ?? fakeSettlementResult}
                isShowWinningEffect={showWinningAnimation}
            />
        );
    }

    renderRoundHistory() {
        const { gameState, roundHistory } = this.state;
        return (
            <ChainRoundHistory
                roundHistory={roundHistory}
                gameState={gameState}
                renderGameDot={RenderKenoProMaxDot}
                renderRoundDetail={RenderRoundDetail}
            ></ChainRoundHistory>
        );
    }

    renderStatistic() {
        return <KenoProMaxStatistic roundHistory={this.state.roundHistory}></KenoProMaxStatistic>;
    }

    renderBoard() {
        const { roundHistory } = this.state;
        return (
            <ScoreboardDragon
                roundHistory={roundHistory}
                getElementRound={GetElementRound}
                checkCondition={CheckCondition}
                translate={this.props.t}
            />
        );
    }

    get isShowStartRoundAnimation() {
        return this.state.gameState === GameState.BeforeStartRound;
    }

    renderResult() {
        const { result } = this.state;
        return <KenoProMaxResult result={result ?? [7, 9, 11, 15, 20, 22, 28, 30, 32, 34, 37, 47, 49, 53, 64, 67, 68, 70, 78, 79]} />;
    }

    renderResultCollapse() {
        const { result, settlementResult } = this.state;
        return (
            <KenoProMaxResultCollapse
                result={result ?? [7, 9, 11, 15, 20, 22, 28, 30, 32, 34, 37, 47, 49, 53, 64, 67, 68, 70, 78, 79]}
                settlementResult={settlementResult}
            />
        );
    }

    renderGuide() {
        const gameName = this.props.t(`${this.props.gameName.toLowerCase()}:${GameResourceKeys.GAME_NAME}`);
        return (
            <AdvanceModal
                title={CommonResourceKeys.GUIDE_POPUP_TITLE}
                gameName={`(${gameName})`}
                isOpen={true}
                onCloseModal={this.closePopup}
                isAddScrollBody={true}
                gameId={this.props.id}
            >
                <></>
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
                onCloseModal={this.closePopup}
                isAddScrollBody={true}
                gameId={this.props.id}
            >
                <KenoProMaxBetHistory />
            </AdvanceModal>
        );
    }

    renderSettlementInfo() {
        return <></>;
    }
}

export default withRouter(withTranslation()(KenoProMax));
