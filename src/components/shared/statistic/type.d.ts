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
    settlementResult: {};
    roundId: number;
}
