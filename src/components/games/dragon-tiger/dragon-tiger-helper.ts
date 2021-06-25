import { Result } from "./dragon-tiger";

const getValueCard = (result: Result, name: string) => {
    return result[name].card;
};

export const CardTypeCharacter = ["♠", "♣", "♦", "♥"];

export const CardValueCharacter = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

export const Choices = { dragon: "dragon", tiger: "tiger", tie: "tie" };

export const checkIsDragon = (result: Result) => {
    return getValueCard(result, Choices.dragon) > getValueCard(result, Choices.tiger);
};

export const checkIsTie = (result: Result) => {
    return getValueCard(result, Choices.dragon) === getValueCard(result, Choices.tiger);
};
