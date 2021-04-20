import { Result } from "./dragon-tiger";

const choice = ["dragon", "tiger"];
const getValueCard = (result: Result, name: string) => {
    return result[name].card;
};

export const checkIsDragon = (result: Result) => {
    return getValueCard(result, choice[0]) > getValueCard(result, choice[1]);
};

export const checkIsTie = (result: Result) => {
    return getValueCard(result, choice[0]) === getValueCard(result, choice[1]);
};