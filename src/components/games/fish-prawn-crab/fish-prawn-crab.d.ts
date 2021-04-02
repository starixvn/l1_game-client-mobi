export interface SettlementResult {
    crab: boolean;
    fish: boolean;
    gourd: boolean;
    prawn: boolean;
    rooster: boolean;
    stag: boolean;
}

export interface Result {
    dice1: boolean;
    dice2: boolean;
    dice3: boolean;
}

export enum BaseResult{
    stag,
    gourd,
    rooster,
    fish,
    crab,
    prawn
}

export interface ResultStatistic {
    result:BaseResult[]
}
