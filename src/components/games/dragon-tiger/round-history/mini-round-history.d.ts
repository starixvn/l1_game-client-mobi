import { Result, SettlementResult } from "../big-small";

export type Props = {
    roundHistory: Round<Result, SettlementResult>[];
    gameState: number;
};
