import { Result } from "./sedie";

export const countRedDot = (result: Result) => Object.keys(result).reduce((total, key) => (result[key] ? total + 1 : total), 0);
export const checkIsEven = (numberOfRedDot: number) => numberOfRedDot % 2 === 0;
export const Choices = {
    odd: "odd",
    even: "even",
    red4: "red4",
    red3: "red3",
    red2: "red2",
    white4: "white4",
    white3: "white3",
};

export const MainChoice = [Choices.even, Choices.odd];
