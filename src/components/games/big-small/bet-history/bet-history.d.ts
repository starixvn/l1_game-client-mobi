import { Result, SettlementResult } from "../big-small";
import { BetLogsBase } from "../../../shared/game-base/type";

export interface BetLogs extends BetLogsBase<Result, SettlementResult> {
    choice: string;
}
