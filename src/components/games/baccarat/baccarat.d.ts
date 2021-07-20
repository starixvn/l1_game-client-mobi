export type SettlementResult = {
    banker: boolean;
    bankerPair: boolean;
    big: boolean;
    natural: boolean;
    player: boolean;
    playerPair: boolean;
    small: boolean;
    tie: boolean;
};

export type CardType = {
    card: number;
    type: number;
};

export type Cards = {
    card1: CardType;
    card2: CardType;
    card3: CardType | null;
};

export type Result = {
    banker: Cards;
    player: Cards;
};

export type Odd = {
    banker: number;
    bankerPair: number;
    big: number;
    player: number;
    playerPair: number;
    small: number;
    tie: number;
};

export type CardOrder = {
    value: CardType;
    order: number;
};
