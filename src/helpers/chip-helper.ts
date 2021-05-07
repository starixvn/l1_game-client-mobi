import { ChipValues } from "../common/constants";

export const convertAmountToChips = (amount: number) => {
    const chipAmountOrderByDecrease = [...ChipValues].reverse();

    let currentAmount = amount;

    return chipAmountOrderByDecrease.reduce((result, value) => {
        const numberOfChips = Math.floor(currentAmount / value);

        currentAmount -= numberOfChips * value;

        return [...result, ...Array(numberOfChips).fill(value)];
    }, []);
};
