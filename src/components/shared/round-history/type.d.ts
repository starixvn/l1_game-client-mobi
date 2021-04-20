export interface DiceColor {
    class: string;
    count: number;
}

export interface StatisticItem {
    type: DiceColor[];
    value: number;
    roundId: number;
}

export interface MiniRoundHistoryType {
    type: number;
    settlementResult: any;
    roundId: number;
    result: any;
}

export interface RoundHistoryType {
    settlementResult: any;
    result: any;
    roundId: number;
}
