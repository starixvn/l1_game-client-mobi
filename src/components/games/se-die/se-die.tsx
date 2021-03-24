import GameBase from "../../shared/game-base";
import { GameBaseProps, GameBaseState, GameState } from "../../shared/game-base/type";
import GameContainer from "../../shared/game-container";
import SeDieBetOptions from "./se-die-bet-options";
import { Result, SettlementResult } from "./sedie";
import SeDieStatistic from "./se-die-statistic";
import React from "react";

class SeDie extends GameBase<GameBaseProps, GameBaseState<Result, SettlementResult>> {
    constructor(props: GameBaseProps) {
        super(props);

        this.state = {
            signedIn: false,
            gameState: GameState.None,
            remainingTime: 0,
            gameConfigs: null,
            roundHistory: [],
            roundId: 0,
        };
    }

    renderGame() {
        const { gameState, roundHistory, gameConfigs, result, settlementResult } = this.state;

        return (
            <React.Fragment>
                <SeDieBetOptions
                    odds={gameConfigs.odds}
                    gameState={gameState}
                    result={result}
                    settlementResult={settlementResult}
                ></SeDieBetOptions>
                <SeDieStatistic roundHistory={roundHistory} gameState={gameState}></SeDieStatistic>
            </React.Fragment>
        );
    }
}

export default SeDie;
