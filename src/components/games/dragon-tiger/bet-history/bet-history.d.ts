import { Result, SettlementResult, Odd } from "../dragon-tiger";
import { BetLogsBase } from "../../../shared/game-base/type";

export interface BetLogs extends BetLogsBase<Result, SettlementResult, Odd> {
    dragon: number;
    tiger: number;
    tie: number;
}
