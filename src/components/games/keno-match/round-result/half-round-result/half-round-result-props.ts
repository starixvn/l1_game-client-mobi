import { Result, SettlementResult } from "../../type";

export interface HalfRoundResultProps {
    result: Result;
    headerText: string;
    className: string;
    active: boolean;
    gameName: string;
};

export interface HalfRoundResultPopupProps extends HalfRoundResultProps {
    settlementResult: SettlementResult;
};

export interface TeamProps {
    result: number[];
    teamName: string;
};