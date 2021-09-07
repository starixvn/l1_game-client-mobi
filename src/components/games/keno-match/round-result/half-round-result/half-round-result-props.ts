import { Result } from "../../type";

export interface HalfRoundResultProps {
    result: Result;
    headerText: string;
    className: string,
    active: boolean;
    gameName: string;
};

export interface TeamProps {
    result: number[];
    className: string,
    teamName: string
};