import { Result, SettlementResult } from "../dragon-tiger";

export type Props = {
    result?: Result;
    settlementResult?: SettlementResult;
};

export enum ResultChoiceMapping {
    dragon,
    tiger,
}
