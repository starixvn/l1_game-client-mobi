export interface DiceColor {
  class: string;
  count: number;
}

export interface ResultDice {
  odd: number;
  even: number;
}

export interface DataType {
  type: DiceColor;
  value: number;
  roundId: number;
}

export interface StatisticType {
  data: Array<DataType>;
  statistic: ResultDice;
  resultDiceRed: Array<number>;
}
