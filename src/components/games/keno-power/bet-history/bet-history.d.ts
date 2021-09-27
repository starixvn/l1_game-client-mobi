import { Result, SettlementResult, Odd } from "..";
import { BetLogsBase } from "../../../shared/game-base/type";

export interface BetLogs extends BetLogsBase<Result, SettlementResult, Odd> {
    big: number;
    earth: number;
    even: number;
    fire: number;
    gold: number;
    odd: number;
    small: number;
    water: number;
    wood: number;
}

export interface BetDetailProps {
    amount: number;
    time: string;
    choice: string;
}
