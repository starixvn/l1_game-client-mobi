import { Round } from "../../../../../types";

export interface Props<R, S> {
    roundHistory: Round<R, S>[];
    getElementRound: (result: any, col: number, row: number, roundId: number, translate?: Function) => void;
    checkCondition?: (settlementResult: S) => void;
    translate?: Function;
}
