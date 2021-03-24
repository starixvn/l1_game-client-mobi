export interface DiceColor {
    class: string;
    count: number;
}

export interface StatisticItem {
    type: DiceColor;
    value: number;
    roundId: number;
}

export interface MiniStatisticItem {
    class: string;
    count: number;
    settlementResult: any;
    roundId: number;
    result: any;
}
