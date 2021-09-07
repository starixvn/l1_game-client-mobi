import { withTranslation } from "next-i18next";
import { withRouter } from "next/router";
import React from "react";

import GatewayGameBase from "../../shared/game-base/gateway-gamebase";
import { GameBaseState, GameState, GatewayGameBaseProps } from "../../shared/game-base/type";
import ChainRoundHistory from "../../shared/round-history/chain";
import { RoundDot } from "../../shared/round-history/dot";
import ScoreboardDragon from "../../shared/round-history/scoreboard/dragon";
import { OpenThePlate, SeDieResultCollapse, ShakeThePlate } from "./animations";
import SeDieBetOptions from "./bet-options";
import { RenderRoundDetail, RenderSeDieDot } from "./round-history";
import GetScoreboardDotDetails, { ConditionChangeDot } from "./scoreboard-round-history";
import Styles from "./se-die.module.scss";
import { Result, SettlementResult } from "./sedie";
import SeDiceStatistic from "./statistic";

export class SeDie extends GatewayGameBase<GatewayGameBaseProps, GameBaseState<Result, SettlementResult>> {
    constructor(props: GatewayGameBaseProps) {
        super(props);

        this.state = { ...this.defaultState };
    }

    get Choices() {
        return ["even", "odd", "red3", "red2", "white3", "red4", "white4"];
    }

    getMainOptions(): string[] {
        return ["odd", "even"];
    }

    renderBetOptions() {
        const { gameState, settlementResult, showWinningAnimation } = this.state;
        const fakeSettlementResult = { even: false, odd: false, red2: false, red3: false, red4: false, white3: false, white4: false };
        return (
            <SeDieBetOptions
                choices={this.Choices}
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
        return (
            <ScoreboardDragon roundHistory={roundHistory} getDotDetails={GetScoreboardDotDetails} conditionChangeDot={ConditionChangeDot} />
        );
    }

    get isShowStartRoundAnimation() {
        return this.state.gameState === GameState.BeforeStartRound;
    }

    renderStartRoundAnimation() {
        const { durations } = this.props;
        const { roundId } = this.state;

        return (
            <ShakeThePlate
                key={roundId}
                playAnimation={this.timeCounter >= durations.placingBets + durations.beforeStartRound}
                roundId={roundId}
            />
        );
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
