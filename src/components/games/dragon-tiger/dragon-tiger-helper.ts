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
