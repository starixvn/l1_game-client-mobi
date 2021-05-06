import { Round } from "../../../../../types";

export interface Props<R, S> {
    roundHistory: Round<R, S>[];
    gameState: number;
    getElementRound: (result: any, col: number, row: number, roundId: number) => void;
    checkCondition?: (settlementResult: S) => void;
}
