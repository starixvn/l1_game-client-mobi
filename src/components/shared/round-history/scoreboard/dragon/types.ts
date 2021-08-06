import { GameBaseProps } from "./../../../game-base/type";
import { Round } from "../../../../../types";

export interface Props<R, S> {
    roundHistory: Round<R, S>[];
    getDotDetails: Function;
    conditionChangeDot?: (settlementResult: S) => void;
    translateDotTextMapping?: object;
}
