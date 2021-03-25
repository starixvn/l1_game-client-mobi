import { MiniRoundHistoryType } from "../../../shared/round-history/type";

export type PropsMiniRound = {
    round: MiniRoundHistoryType;
};

export type Props = {
    roundHistory: [];
    countItem: number;
    gameState: number;
    children: any[];
};

export enum DiceTypeColor {
    red,
    white,
}
