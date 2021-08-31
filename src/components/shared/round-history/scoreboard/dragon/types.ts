import { Round, RoundKenoMatch } from "../../../../../types";

export interface Props<R, S> {
    roundHistory: Round<R, S>[] | RoundKenoMatch[];
    getDotDetails: Function;
    conditionChangeDot?: Function;
    translateDotTextMapping?: object;
    getRoundValue?: Function;
}
