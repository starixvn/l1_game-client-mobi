import { GameState } from "../../../shared/game-base/type";
import { Result, SettlementResult } from "../sedie";

export type Props = {
    result?: Result;
    settlementResult?: SettlementResult;
    gameState: GameState;
};
