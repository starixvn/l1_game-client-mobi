import { Result } from "./big-small";

export const countRedDot = (result: Result) => Object.values(result).reduce((total, value) => total + value, 0);
export const checkIsSmall = (numberOfRed: number) => numberOfRed <= 10;
