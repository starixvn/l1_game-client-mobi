import React from "react";

import GameBase from "../../shared/game-base";
import { GameBaseProps, GameBaseState, GameState } from "../../shared/game-base/type";
import SeDieBetOptions from "./se-die-bet-options";
import SeDieStatistic from "./se-die-statistic";
import { Result, SettlementResult } from "./sedie";

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
            ownBets: {},
            totalBets: {},
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
