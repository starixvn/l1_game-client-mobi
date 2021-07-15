import { Result } from "./keno-pro-max";

export const countRedDot = (result: Result) => Object.keys(result).reduce((total, key) => (result[key] ? total + 1 : total), 0);
export const checkIsEven = (numberOfRedDot: number) => numberOfRedDot % 2 === 0;
export const Choices = {
    big: "big",
    small: "small",
    even: "even",
    odd: "odd",
    earth: "earth",
    fire: "fire",
    gold: "gold",
    water: "water",
    wood: "wood",
};
