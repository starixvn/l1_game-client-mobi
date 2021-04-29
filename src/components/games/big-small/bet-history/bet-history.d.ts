import { Result, SettlementResult, Odd } from "../big-small";
import { BetLogsBase } from "../../../shared/game-base/type";

export interface BetLogs extends BetLogsBase<Result, SettlementResult, Odd> {
    choice: string;
}
