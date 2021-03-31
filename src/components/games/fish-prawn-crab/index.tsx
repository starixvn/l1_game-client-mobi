import React from "react";

import GameBase from "../../shared/game-base";
import { GameBaseProps, GameBaseState, GameState } from "../../shared/game-base/type";
import { Result, SettlementResult } from "./fish-prawn-crab";
import FishPrawnCrabBetOptions from "./bet-options";
import FishPrawnCrabHistory from "./round-history";

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
        const { gameState, roundHistory, gameConfigs, result, settlementResult } = this.state;

        return (
            <React.Fragment>
                <FishPrawnCrabBetOptions
                    odds={gameConfigs.odds}
                    gameState={gameState}
                    result={result}
                    settlementResult={settlementResult}
                />
                <FishPrawnCrabHistory roundHistory={roundHistory} gameState={gameState}></FishPrawnCrabHistory>
            </React.Fragment>
        );
    }
}

export default FishPrawnCrab;
