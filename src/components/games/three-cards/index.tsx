import { withTranslation } from "next-i18next";
import { withRouter } from "next/router";
import React from "react";
import { CommonResourceKeys, GameResourceKeys } from "../../../common/resources";
import AdvanceModal from "../../shared/advance-modal";
import GameBase from "../../shared/game-base";
import { GameBaseProps, GameBaseState, GameState } from "../../shared/game-base/type";
import ChainRoundHistory from "../../shared/round-history/chain";
import ScoreboardDragon from "../../shared/round-history/scoreboard/dragon";
import { ThreeCardsResult } from "./animations";
import ThreeCardsBetHistory from "./bet-history";
import ThreeCardsBetOptions from "./bet-options";
import { RenderRoundDetail, RenderThreeCardsDot } from "./round-history";
import GetElementRound, { CheckCondition } from "./scoreboard-round-history";
import Styles from "./three-cards.module.scss";
import { Result, SettlementResult } from "./three-cards";
import ThreeCardsStatistic from "./statistic";

class ThreeCards extends GameBase<GameBaseProps, GameBaseState<Result, SettlementResult>> {
    constructor(props: GameBaseProps) {
        super(props);

        this.state = { ...this.defaultState };
    }

    getMainOptions(): string[] {
        return ["black", "red", "diamonds", "hearts", "spades", "clubs"];
    }

    renderBetOptions() {
        const { gameState, settlementResult, showWinningAnimation } = this.state;
        const fakeSettlementResult = { red: true, black: false, diamonds: true, hearts: false, spades: false, clubs: true };
        return (
            <ThreeCardsBetOptions
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
                renderGameDot={RenderThreeCardsDot}
                renderRoundDetail={RenderRoundDetail}
            ></ChainRoundHistory>
        );
    }

    renderStatistic() {
        return <ThreeCardsStatistic roundHistory={this.state.roundHistory}></ThreeCardsStatistic>;
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
            <ThreeCardsResult
                result={
                    result ?? [
                        { rank: "Q", suit: 1 },
                        { rank: "10", suit: 2 },
                        { rank: "4", suit: 1 },
                    ]
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
                <ThreeCardsBetHistory />
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

export default withRouter(withTranslation()(ThreeCards));
