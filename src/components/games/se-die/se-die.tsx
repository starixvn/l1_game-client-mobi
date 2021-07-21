import { withTranslation } from "next-i18next";
import { withRouter } from "next/router";
import React from "react";

import { LanguageLocaleMapper } from "../../../common/constants";
import { CommonResourceKeys, GameResourceKeys } from "../../../common/resources";
import AdvanceModal from "../../shared/advance-modal";
import GameBase from "../../shared/game-base";
import { GameBaseProps, GameBaseState, GameState } from "../../shared/game-base/type";
import GameGuides from "../../shared/game-guide";
import ChainRoundHistory from "../../shared/round-history/chain";
import { RoundDot } from "../../shared/round-history/dot";
import ScoreboardDragon from "../../shared/round-history/scoreboard/dragon";
import { OpenThePlate, SeDieResultCollapse, ShakeThePlate } from "./animations";
import SeDieBetHistory from "./bet-history";
import SeDieBetOptions from "./bet-options";
import { RenderRoundDetail, RenderSeDieDot } from "./round-history";
import GetElementRound, { CheckCondition } from "./scoreboard-round-history";
import Styles from "./se-die.module.scss";
import { Result, SettlementResult } from "./sedie";
import SeDiceStatistic from "./statistic";

class SeDie extends GameBase<GameBaseProps, GameBaseState<Result, SettlementResult>> {
    constructor(props: GameBaseProps) {
        super(props);

        this.state = { ...this.defaultState };
    }

    getMainOptions(): string[] {
        return ["odd", "even"];
    }

    renderBetOptions() {
        const { gameState, settlementResult, showWinningAnimation } = this.state;
        const fakeSettlementResult = { even: false, odd: false, red2: false, red3: false, red4: false, white3: false, white4: false };
        return (
            <SeDieBetOptions
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
        const { roundId } = this.state;

        return <ShakeThePlate roundId={roundId} playAnimation={this.timeCounter >= durations.placingBets + durations.beforeStartRound} />;
    }

    renderResult() {
        const { result } = this.state;
        return <OpenThePlate result={result ?? { red1: false, red2: false, red3: true, red4: false }} />;
    }

    renderResultCollapse() {
        const { result, settlementResult } = this.state;
        return (
            <SeDieResultCollapse
                result={result ?? { red1: false, red2: false, red3: true, red4: false }}
                settlementResult={settlementResult}
            />
        );
    }

    renderGuide() {
        const gameName = this.props.t(`${this.props.gameName.toLowerCase()}:${GameResourceKeys.GAME_NAME}`);
        const lang = LanguageLocaleMapper[this.props.i18n?.language];
        return (
            <AdvanceModal
                title={CommonResourceKeys.GUIDE_POPUP_TITLE}
                gameName={`(${gameName})`}
                isOpen={true}
                onCloseModal={this.closePopup}
                isAddScrollBody={true}
                gameId={this.props.id}
            >
                <GameGuides
                    gameId={this.props.id}
                    language={lang}
                    theme={this.props.theme}
                    userStakeLevel={this.state.userStakeLevel}
                ></GameGuides>
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
                <SeDieBetHistory />
            </AdvanceModal>
        );
    }

    renderSettlementInfo() {
        const { result, settlementResult } = this.state;

        const redDotCount = Object.values(result).filter((dot) => dot).length;
        const whiteDotCount = 4 - redDotCount;

        return (
            <div className={Styles["result-container"]}>
                <div className={Styles["left"]}>
                    <div className={`d-flex ${Styles["row1"]}`}>
                        <RoundDot choice="even" size="medium" />
                        <span className={Styles["number"]}>{whiteDotCount}</span>
                    </div>
                    <div className="d-flex">
                        <RoundDot choice="odd" size="medium" />
                        <span className={Styles["number"]}>{redDotCount}</span>
                    </div>
                </div>
                <div className={Styles["line"]}></div>
                <div>
                    {settlementResult.even ? (
                        <div className={Styles["result-info-grey"]}>{this.getGameTranslate("even")}</div>
                    ) : (
                        <div className={Styles["result-info-red"]}>{this.getGameTranslate("odd")}</div>
                    )}
                </div>
            </div>
        );
    }
}

export default withRouter(withTranslation()(SeDie));
