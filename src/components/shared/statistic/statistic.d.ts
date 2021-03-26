import { interopDefault } from "next/dist/next-server/server/load-components";
import { SettlementResult } from "./../../games/keno-pro-max/keno-pro-max-type.d";
export type Props = {
    roundHistory: any[];
    gameState: number;
};

export interface StatisticType {
    settlementResult: number[];
    result: number[];
}

export interface historyData {
    result: any;
    roundId: number;
    settlementResult: any;
}
