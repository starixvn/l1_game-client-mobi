import { Result } from "../../type";

export interface HalfRoundResultProps {
    result: Result;
    headerText: string;
    className: string,
    active: boolean;
};

export interface TeamProps {
    result: number[];
    className: string,
};