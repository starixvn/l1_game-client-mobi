import { Result } from "./sedie";

export const countRedDot = (result: Result) => Object.keys(result).reduce((total, key) => (result[key] ? total + 1 : total), 0);
export const checkIsEven = (numberOfRedDot: number) => numberOfRedDot % 2 > 0;
