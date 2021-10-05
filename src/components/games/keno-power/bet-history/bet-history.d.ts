import { Result, SettlementResult, Odd } from "..";
import { BetLogsBase } from "../../../shared/game-base/type";

export interface BetLogs extends BetLogsBase<Result, SettlementResult, Odd> {
    blue: number;
    red: number;
    big: number;
    small: number;
    odd: number;
    even: number;
    blueBig: number;
    blueSmall: number;
    redBig: number;
    redSmall: number;
}

export interface BetDetailProps {
    amount: number;
    time: string;
    choice: string;
}
