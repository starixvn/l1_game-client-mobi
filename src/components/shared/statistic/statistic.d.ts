export type Props = {
    roundHistory: any[];
    gameState: number;
};

export interface StatisticType {
    settlementResult?: number[];
    result?: number[];
}

export interface historyData {
    result: any;
    roundId: number;
    settlementResult: any;
}
