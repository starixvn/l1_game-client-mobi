import React, { useState } from "react";

import DrawResult from "./bet-options";
import Styles from "./game.module.scss";
import {
    KenoMatchGameBaseState,
    KenoMatchProps,
    KenoMatchSettlementResult,
    KenoMatchResult,
    KenoMatchGameState,
    KenoMatchGameDurations,
} from "./type";
import { GameBaseProps, GameBaseState, GameState } from "../../shared/game-base/type";
import GameBase from "../../shared/game-base";

export const choicesMapper = {
    fhBlue: 1,
    fhRed: 2,
    fhOver: 3,
    fhUnder: 4,
    fhEven: 5,
    fhOdd: 6,
    ftBlue: 7,
    ftRed: 8,
    ftOver: 9,
    ftUnder: 10,
    ftEven: 11,
    ftOdd: 12,
    liveFTBlue: 13,
    liveFTRed: 14,
    liveFTOver: 15,
    liveFTUnder: 16,
    liveFTOdd: 17,
    liveFTEven: 18,
};

const defaultResult = {
    blue: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    red: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
};

class KenoMatch extends GameBase<KenoMatchProps, KenoMatchGameBaseState<KenoMatchResult, KenoMatchSettlementResult>> {
    constructor(props: KenoMatchProps) {
        super(props);

        // this.state = { ...this.defaultState };

        this.state = {
            ...this.defaultState,
            ...{
                kenoMatchGameState: KenoMatchGameState.None,
                roundHistory: [],
                halfTimeResult: defaultResult,
                fullTimeResult: defaultResult,
                activeHalfTimeResult: false,
            },
        };

        // this.registerMessageHandler();
    }

    getMainOptions(): string[] {
        return Object.keys(choicesMapper);
    }

    renderBetOptions() {
        const { gameState, roundId, halfTimeResult, fullTimeResult, remainingTime, activeHalfTimeResult, kenoMatchGameState } = this.state;
        return (
            <DrawResult
                gameState={kenoMatchGameState}
                halfTimeResult={halfTimeResult}
                fullTimeResult={fullTimeResult}
                isHalfTimeActive={activeHalfTimeResult}
            />
        );
    }

    renderRoundHistory() {
        const { gameState, roundHistory } = this.state;
        return <></>;
    }

    renderStatistic() {
        return <></>;
    }

    renderBoard() {
        const { roundHistory } = this.state;
        return <></>;
    }

    get isShowStartRoundAnimation() {
        return this.state.gameState === GameState.BeforeStartRound;
    }

    renderStartRoundAnimation() {
        const { durations } = this.props;
        const { roundId } = this.state;

        return <></>;
    }

    renderResult() {
        const { result } = this.state;
        return <></>;
    }

    renderResultCollapse() {
        const { result, settlementResult } = this.state;
        return <></>;
    }

    renderSettlementInfo() {
        return <div className={Styles["result-container"]}></div>;
    }

    registerMessageHandler = () => {
        super.registerMessageHandler();
        this.messageTransmitter.register("finishHalfTime", this.handleFinishHalfTime.bind(this));
    };

    handleGamePlay(remainingTime: number) {
        const durations = this.props.durations as KenoMatchGameDurations;
        const activeHalfTimeResult = remainingTime <= durations.resetResult && remainingTime >= 0;

        if (this.state.activeHalfTimeResult !== activeHalfTimeResult) {
            this.setState({ activeHalfTimeResult });
        }

        if (remainingTime === durations.resetResult) {
            this.setState({ halfTimeResult: defaultResult, fullTimeResult: defaultResult });
        }

        const newGameState = this.determineGameState(remainingTime);

        if (this.state.kenoMatchGameState !== newGameState) {
            const newState = {
                KenoMatchGameState: newGameState,
                roundHistory:[],
                activeHalfTimeResult:false,
                ...this.getStateByNextGameState(newGameState)
            };

            this.setState(newState as any);

            console.log('set new state');
        }
    }

    determineGameState(remainingTime: number) {
        const durations = this.props.durations as KenoMatchGameDurations;

        switch (true) {
            case remainingTime <= durations.wholeRound && remainingTime > durations.showFullTimeSettlementResult:
                return KenoMatchGameState.ShowFullTimeResult;
            case remainingTime <= durations.showFullTimeSettlementResult && remainingTime > durations.halfTimePlacingBets:
                return KenoMatchGameState.ShowFullTimeSettlementResult;
            case remainingTime <= durations.halfTimePlacingBets && remainingTime > durations.halfTimeLockingBet:
                return KenoMatchGameState.HalfTime;
            case remainingTime <= durations.halfTimeLockingBet && remainingTime >= durations.finishHalfTime:
                return KenoMatchGameState.HalfTimeLockingBet;
            case remainingTime <= durations.finishHalfTime && remainingTime > durations.halfTimeLockingBet:
                return KenoMatchGameState.ShowHalfTimeResult;
            case remainingTime <= durations.showHalfTimeSettlementResult && remainingTime > durations.halfTimePlacingBets:
                return KenoMatchGameState.ShowHalfTimeSettlementResult;
            case remainingTime <= durations.fullTimePlacingBets && remainingTime > durations.fullTimeLockingBet:
                return KenoMatchGameState.FullTime;
            case remainingTime <= durations.fullTimeLockingBet && remainingTime >= 0:
                return KenoMatchGameState.FullTimeLockingBet;
            default:
                return KenoMatchGameState.None;
        }
    }

    getStateByNextGameState(nextGameState: KenoMatchGameState) {
        const newStateDetector = [
            {
                condition: nextGameState === KenoMatchGameState.HalfTime,
                state: {
                    roundId: this.state.roundId + 1,
                    ownBets: {},

                    settlementResult: {},
                },
            },
        ];

        return newStateDetector.reduce(
            (newState, stateDetector) => {
                if (stateDetector.condition) {
                    newState = Object.assign(newState, stateDetector.state);
                }

                return newState;
            },
            { remainingTime: this.timeCounter }
        );
    }

    handleRoundHistory({ roundHistory, roundId }) {
        const { kenoMatchGameState } = this.state;

        this.setState({
            roundHistory: roundHistory.slice(0, 40),
            roundId: [KenoMatchGameState.ShowFullTimeResult, KenoMatchGameState.ShowFullTimeSettlementResult].includes(kenoMatchGameState) ? roundId - 1 : roundId,
        });
    }

    handleFinishHalfTime({ finishHalfTime }) {
        this.setState({
            halfTimeResult: finishHalfTime.result,
            settlementResult: finishHalfTime.settlementResult,
        });
    }

    handleFinish({ finish }) {
        const { roundHistory } = this.state;
        const { durations } = this.props;
        const roundHistoryClone = [...roundHistory];

        roundHistoryClone.unshift(finish);
        roundHistoryClone.length > 100 && roundHistoryClone.pop();

        this.setState({
            fullTimeResult: finish.result,
            settlementResult: finish.settlementResult,
            roundHistory: roundHistoryClone,
        });

        this.runGame(durations.wholeRound);
    }
}

export default KenoMatch;
