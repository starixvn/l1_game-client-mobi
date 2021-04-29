import { Result, SettlementResult } from "../dragon-tiger";
import { BetLogsBase } from "../../../shared/game-base/type";

export interface BetLogs extends BetLogsBase<Result, SettlementResult> {
    dragon: number;
    tiger: number;
    tie: number;
}
