export type Props = {
    roundHistory: any[];
    gameState: number;
};

export interface StatisticType {
    settlementResult: number[];
    result: number[];
    roundId: number;
}

export interface historyData {
    result: any;
    roundId: number;
    settlementResult: any;
}
