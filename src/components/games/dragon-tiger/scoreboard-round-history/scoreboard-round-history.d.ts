import { Result, SettlementResult } from "../dragon-tiger";

export type Props = {
    roundHistory: Round<Result, SettlementResult>[];
    gameState: number;
};
