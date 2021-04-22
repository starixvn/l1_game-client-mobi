import { Round } from "../../../../types";
import { Result, SettlementResult } from "../sedie";

export type Props = {
    roundHistory: Round<Result, SettlementResult>[];
};

export enum ResultDiceRed {
    red1,
    red2,
    red3,
    red4,
    white,
}
