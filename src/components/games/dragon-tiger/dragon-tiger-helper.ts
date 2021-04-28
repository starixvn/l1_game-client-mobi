import { Result } from "./dragon-tiger";

export const Choices = { dragon: "dragon", tiger: "tiger", tie: "tie" };
const getValueCard = (result: Result, name: string) => {
    return result[name].card;
};

export const checkIsDragon = (result: Result) => {
    return getValueCard(result, Choices.dragon) > getValueCard(result, Choices.tiger);
};

export const checkIsTie = (result: Result) => {
    return getValueCard(result, Choices.dragon) === getValueCard(result, Choices.tiger);
};
export const convertRank = (num: number): string => {
    num++;
    const dict = {
        11: "J",
        12: "Q",
        13: "K",
        1: "A",
    };
    return dict[num] || num.toString();
};
