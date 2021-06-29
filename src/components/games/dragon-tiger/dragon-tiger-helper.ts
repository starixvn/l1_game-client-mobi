import { Result } from "./dragon-tiger";

const getValueCard = (result: Result, name: string) => {
    return result[name].card;
};

export const CardTypeCharacter = ["card-heart", "card-diamond", "card-club", "card-spade"];

export const CardValueCharacter = ["A(1)", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J(11)", "Q(12)", "K(13)"];

export const Choices = { dragon: "dragon", tiger: "tiger", tie: "tie" };

export const checkIsDragon = (result: Result) => {
    return getValueCard(result, Choices.dragon) > getValueCard(result, Choices.tiger);
};

export const checkIsTie = (result: Result) => {
    return getValueCard(result, Choices.dragon) === getValueCard(result, Choices.tiger);
};
