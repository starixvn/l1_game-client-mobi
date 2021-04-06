import React from "react";

import GameBase from "../../shared/game-base";
import { GameBaseProps, GameBaseState, GameState } from "../../shared/game-base/type";
import { BigSmallResult, BigSmallSettlementResult } from "./big-small";

class BigSmall extends GameBase<GameBaseProps, GameBaseState<BigSmallResult, BigSmallSettlementResult>> {
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
        const fakeSettlementResult = { even: false, odd: false, red2: false, red3: false, red4: false, white3: false, white4: false };

        return <React.Fragment></React.Fragment>;
    }
}

export default BigSmall;
