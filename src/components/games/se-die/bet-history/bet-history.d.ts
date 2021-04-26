import { Result, SettlementResult } from "../sedie";
import { BetLogsBase } from "../../../shared/game-base/type";

export interface BetLogs extends BetLogsBase<Result, SettlementResult> {
    even: number;
    odd: number;
    red2: number;
    red3: number;
    red4: number;
    white3: number;
    white4: number;
}
