import { withTranslation } from "next-i18next";
import { withRouter } from "next/router";
import React from "react";

import { CommonResourceKeys, GameResourceKeys } from "../../../common/resources";
import SeDieGuide from "../../game-guide/se-die";
import AdvanceModal from "../../shared/advance-modal";
import GameBase from "../../shared/game-base";
import { GameBaseProps, GameBaseState, GameState } from "../../shared/game-base/type";
import ChainRoundHistory from "../../shared/round-history/chain";
import ScoreboardDragon from "../../shared/round-history/scoreboard/dragon";
import { OpenThePlate, SeDieResultCollapse, ShakeThePlate } from "./animations";
import SeDieBetHistory from "./bet-history";
import SeDieBetOptions from "./bet-options";
import { RenderRoundDetail, RenderSeDieDot } from "./round-history";
import GetElementRound, { CheckCondition } from "./scoreboard-round-history";
import { Result, SettlementResult } from "./sedie";
import SeDiceStatistic from "./statistic";
import Styles from "./se-die.module.scss";
import { RoundDot } from "../../shared/round-history/dot";

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
        return <ShakeThePlate playAnimation={this.timeCounter === durations.placingBets + durations.beforeStartRound} />;
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
        return (
            <AdvanceModal
                title={CommonResourceKeys.GUIDE_POPUP_TITLE}
                gameName={`(${gameName})`}
                isOpen={true}
                onCloseModal={() => this.closePopup()}
                isAddScrollBody={true}
            >
                <SeDieGuide />
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
                isAddScrollBody={true}
            >
                <SeDieBetHistory />
            </AdvanceModal>
        );
    }

    renderResultInfo() {
        const { result } = this.state;
        // const result = { red1: true, red2: true, red3: true, red4: true };

        return (
            <div className={Styles["result-info"]}>
                {Object.values(result).map((value, index) => (
                    <RoundDot key={index} choice={value ? "odd" : "even"} size="super-large" />
                ))}
            </div>
        );
    }

    renderSettlementInfo() {
        const { result, settlementResult } = this.state;
        // const result = { red1: true, red2: true, red3: true, red4: true };
        // const settlementResult = { even: true, odd: false, red2: true, red3: false, red4: false, white3: false, white4: false };

        const redDotCount = Object.values(result).filter((dot) => dot).length;
        const whiteDotCount = 4 - redDotCount;

        return (
            <div className={Styles["settlement-container"]}>
                <div className={Styles["left"]}>
                    <div className="d-flex">
                        <span className={Styles["number"]}>{whiteDotCount}</span>
                        <RoundDot choice="even" size="medium" />
                    </div>
                    <div className="d-flex">
                        <span className={Styles["number"]}>{redDotCount}</span>
                        <RoundDot choice="odd" size="medium" />
                    </div>
                </div>
                <div className={Styles["line"]}></div>
                <div>
                    {settlementResult.even ? (
                        <div className={Styles["settlement-info-grey"]}>{this.getGameTranslate("even")}</div>
                    ) : (
                        <div className={Styles["settlement-info-red"]}>{this.getGameTranslate("odd")}</div>
                    )}
                </div>
            </div>
        );
    }
}

export default withRouter(withTranslation()(SeDie));
