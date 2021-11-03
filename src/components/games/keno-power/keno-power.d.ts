import { GameBaseState } from "../../shared/game-base/type";

export interface KenoPowerGameState extends GameBaseState<Result, SettlementResult> {
    md5: string;
}

export type SettlementResult = {
    blue: boolean;
    red: boolean;
    tie: boolean;
    big: boolean;
    small: boolean;
    odd: boolean;
    even: boolean;
    blueBig: boolean;
    blueSmall: boolean;
    redBig: boolean;
    redSmall: boolean;
};

export type Result = {
    red: number[];
    blue: number[];
};

export type Odd = {
    blue: number;
    red: number;
    big: number;
    small: number;
    even: number;
    odd: number;
    blueBig: number;
    blueSmall: number;
    redBig: number;
    redSmall: number;
};
