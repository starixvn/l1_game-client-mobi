export interface SettlementResult {
    dragon: boolean;
    tiger: boolean;
    tie: boolean;
}

export interface Result {
    dragon: ObjectResult;
    tiger: ObjectResult;
}

export interface ObjectResult {
    card: number;
    type: number;
}

export type Odd = {
    dragon: number;
    tiger: number;
    tie: number;
};
