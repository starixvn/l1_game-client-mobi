export type SettlementResult = {
    black: boolean;
    clubs: boolean;
    diamonds: boolean;
    hearts: boolean;
    red: boolean;
    spades: boolean;
};

export type Cards = {
    rank: string;
    suit: number;
};

export type Result = [Cards, Cards, Cards];
export type Odd = {
    black: number;
    clubs: number;
    diamonds: number;
    hearts: number;
    red: number;
    spades: number;
};

export type Odd = {
    dragon: number;
    tiger: number;
    tie: number;
};
