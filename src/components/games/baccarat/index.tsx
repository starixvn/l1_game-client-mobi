import { withTranslation } from "next-i18next";
import { withRouter } from "next/router";
import React from "react";
import { CommonResourceKeys, GameResourceKeys } from "../../../common/resources";
import AdvanceModal from "../../shared/advance-modal";
import GameBase from "../../shared/game-base";
import { GameBaseProps, GameBaseState, GameState } from "../../shared/game-base/type";
import ChainRoundHistory from "../../shared/round-history/chain";
import ScoreboardDragon from "../../shared/round-history/scoreboard/dragon";
import { BaccaratResult } from "./animations";
import BaccaratBetHistory from "./bet-history";
import BaccaratBetOptions from "./bet-options";
import { RenderRoundDetail, RenderBaccaratDot } from "./round-history";
import GetElementRound, { CheckCondition } from "./scoreboard-round-history";
import Styles from "./baccarat.module.scss";
import { Result, SettlementResult } from "./baccarat";
import SeDiceStatistic from "./statistic";

class Baccarat extends GameBase<GameBaseProps, GameBaseState<Result, SettlementResult>> {
    constructor(props: GameBaseProps) {
        super(props);

        this.state = { ...this.defaultState };
    }

    getMainOptions(): string[] {
        return ["player", "banker", "big", "small", "tie", "playerPair", "bankerPair"];
    }

    renderBetOptions() {
        const { gameState, settlementResult, showWinningAnimation } = this.state;
        const fakeSettlementResult = {
            banker: false,
            bankerPair: false,
            big: true,
            natural: false,
            player: true,
            playerPair: false,
            small: false,
            tie: false,
        };
        return (
            <BaccaratBetOptions
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
                renderGameDot={RenderBaccaratDot}
                renderRoundDetail={RenderRoundDetail}
            ></ChainRoundHistory>
        );
    }

    renderStatistic() {
        return <SeDiceStatistic roundHistory={this.state.roundHistory}></SeDiceStatistic>;
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
        const { result, roundId } = this.state;
        return (
            <BaccaratResult
                result={
                    result ?? {
                        banker: { card1: { card: 1, type: 0 }, card2: { card: 11, type: 2 }, card3: { card: 12, type: 2 } },
                        player: { card1: { card: 8, type: 3 }, card2: { card: 5, type: 3 }, card3: { card: 8, type: 1 } },
                    }
                }
                roundId={roundId}
            />
        );
    }

    renderResultCollapse() {
        const { result, settlementResult } = this.state;
        return <></>;
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
            >
                <BaccaratBetHistory />
            </AdvanceModal>
        );
    }

    renderSettlementInfo() {
        const { result, settlementResult } = this.state;

        const redDotCount = Object.values(result).filter((dot) => dot).length;
        const whiteDotCount = 4 - redDotCount;

        return <div className={Styles["result-container"]}></div>;
    }
}

export default withRouter(withTranslation()(Baccarat));
