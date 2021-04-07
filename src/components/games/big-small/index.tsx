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

    renderBetOptions() {
        return <></>;
    }

    renderRoundHistory() {
        return <></>;
    }

    renderStatistic() {
        return <></>;
    }

    renderResult() {
        return <></>;
    }

    renderBoard() {
        return <></>;
    }
}

export default BigSmall;
