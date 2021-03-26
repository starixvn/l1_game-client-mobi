export type Props = {
    roundHistory: any;
    gameState: number;
};

export interface SeDieStatistic {
    statistic: {
        odd: number;
        even: number;
    };
    resultDiceRed: resultDiceRed[];
}

export enum resultDiceRed {
    red1,
    red2,
    red3,
    red4,
    white,
}
