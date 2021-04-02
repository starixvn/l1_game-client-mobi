import React from "react";

import GameBase from "../../shared/game-base";
import { GameBaseProps, GameBaseState, GameState } from "../../shared/game-base/type";
import SeDieBetOptions from "./bet-options";
import MiniRoundHistory from "./mini-round-history";
import ScoreboardHistory from "./scoreboard-round-history";
import { Result, SettlementResult } from "./sedie";
import SeDiceStatistic from "./statistic";

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
            history: null,
        };
    }

    renderGame() {
        const { gameState, roundHistory, result, settlementResult } = this.state;
        const fakeSettlementResult = { even: false, odd: false, red2: false, red3: false, red4: false, white3: false, white4: false };

        return (
            <React.Fragment>
                <SeDieBetOptions gameState={gameState} result={result} settlementResult={settlementResult ?? fakeSettlementResult} />
                <MiniRoundHistory roundHistory={roundHistory} gameState={gameState}></MiniRoundHistory>
                <SeDiceStatistic roundHistory={roundHistory}></SeDiceStatistic>
                <ScoreboardHistory roundHistory={roundHistory} gameState={gameState}></ScoreboardHistory>
            </React.Fragment>
        );
    }
}

export default SeDie;
