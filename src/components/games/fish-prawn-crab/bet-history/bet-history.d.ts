import { Result, SettlementResult } from "../fish-prawn-crab";
import { BetLogsBase } from "../../../shared/game-base/type";

export interface BetLogs extends BetLogsBase<Result, SettlementResult> {
    crab: number;
    fish: number;
    gourd: number;
    prawn: number;
    rooster: number;
    stag: number;
}
