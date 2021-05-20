import React from "react";
import { withTranslation } from "react-i18next";

import { CommonResourceKeys } from "../../../common/resources";
import SeDieGuide from "../../game-guide/se-die";
import AdvanceModal from "../../shared/advance-modal";
import GameBase from "../../shared/game-base";
import { GameBaseProps, GameBaseState, GameState } from "../../shared/game-base/type";
import ChainRoundHistory from "../../shared/round-history/chain";
import ScoreboardDragon from "../../shared/round-history/scoreboard/dragon";
import { OpenThePlate, ShakeThePlate } from "./animations";
import SeDieBetHistory from "./bet-history";
import SeDieBetOptions from "./bet-options";
import { RenderRoundDetail, RenderSeDieDot } from "./round-history";
import GetElementRound, { CheckCondition } from "./scoreboard-round-history";
import { Result, SettlementResult } from "./sedie";
import SeDiceStatistic from "./statistic";
import { withRouter } from "next/router";

class SeDie extends GameBase<GameBaseProps, GameBaseState<Result, SettlementResult>> {
    constructor(props: GameBaseProps) {
        super(props);

        this.state = { ...this.defaultState };
    }

    renderBetOptions() {
        const { gameState, settlementResult } = this.state;
        const fakeSettlementResult = { even: false, odd: false, red2: false, red3: false, red4: false, white3: false, white4: false };
        return <SeDieBetOptions gameState={gameState} settlementResult={settlementResult ?? fakeSettlementResult} />;
    }

    renderRoundHistory() {
        const { gameState, roundHistory } = this.state;
        return (
            <ChainRoundHistory
                roundHistory={roundHistory}
                gameState={gameState}
                renderGameDot={RenderSeDieDot}
                renderRoundDetail={RenderRoundDetail}
            ></ChainRoundHistory>
        );
    }

    renderStatistic() {
        return <SeDiceStatistic roundHistory={this.state.roundHistory}></SeDiceStatistic>;
    }

    renderBoard() {
        const { roundHistory } = this.state;
        return <ScoreboardDragon roundHistory={roundHistory} getElementRound={GetElementRound} checkCondition={CheckCondition} />;
    }

    get isShowStartRoundAnimation() {
        return this.state.gameState === GameState.BeforeStartRound;
    }

    renderStartRoundAnimation() {
        const { durations } = this.props;
        return <ShakeThePlate playAnimation={this.timeCounter === durations.placingBets + durations.beforeStartRound} />;
    }

    renderResult() {
        const { result } = this.state;
        return <OpenThePlate result={result ?? { red1: false, red2: false, red3: true, red4: false }} />;
    }

    renderGuide() {
        return (
            <AdvanceModal title={CommonResourceKeys.GUIDE_POPUP_TITLE} isOpen={true} onCloseModal={() => this.closePopup()}>
                <SeDieGuide />
            </AdvanceModal>
        );
    }

    renderBetHistory() {
        return (
            <AdvanceModal title={CommonResourceKeys.HISTORY_POPUP_TITLE} isOpen={true} onCloseModal={() => this.closePopup()}>
                <SeDieBetHistory />
            </AdvanceModal>
        );
    }
}

export default withRouter(withTranslation()(SeDie));
