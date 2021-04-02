import React from "react";

import GameBase from "../../shared/game-base";
import { GameBaseProps, GameBaseState, GameState } from "../../shared/game-base/type";
import { Result, SettlementResult } from "./fish-prawn-crab";
import FishPrawnCrabBetOptions from "./bet-options";
import ScoreboardHistory from "./scoreboard-round-history";
import OddComponent from "./odd";
import StatisticComponent from "./statistic";

class FishPrawnCrab extends GameBase<GameBaseProps, GameBaseState<Result, SettlementResult>> {
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
        const { gameState, roundHistory, result, settlementResult } = this.state;

        return (
            <React.Fragment>
                <FishPrawnCrabBetOptions
                    gameState={gameState}
                    result={result}
                    settlementResult={
                        settlementResult ?? { crab: false, fish: false, gourd: false, prawn: false, rooster: false, stag: false }
                    }
                />
                <OddComponent></OddComponent>
                <StatisticComponent roundHistory={roundHistory}></StatisticComponent>
                <ScoreboardHistory roundHistory={roundHistory} gameState={gameState}></ScoreboardHistory>
            </React.Fragment>
        );
    }
}

export default FishPrawnCrab;
