import { Result, SettlementResult } from "../sedie";

export type Props = {
    roundHistory: Round<Result, SettlementResult>[];
    gameState: number;
};
