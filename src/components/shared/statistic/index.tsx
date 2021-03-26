import { historyData } from "./statistic";

export function handlePercentData(data: any[], templateResult: number[]) {
    const reducer = (accumulator: number, currentValue: number) => accumulator + currentValue;
    const totalDiceRed = data.reduce(reducer);
    let totalPercent = 0;
    data.forEach((diceTotal, index) => {
        const percent = Math.round((diceTotal / totalDiceRed) * 100);
        if (totalPercent + percent > 100) {
            templateResult[index] = 100 - totalPercent;
        } else if (totalPercent === 100) {
            templateResult[index] = 0;
        } else {
            templateResult[index] = percent;
        }

        totalPercent += percent;
    });
    return templateResult;
}

export function processHistorySettlement(historyData: historyData[], keyChoices: string[], templateResult: number[]) {
    historyData.forEach((history: any) => {
        const settlementResult = history.settlementResult;
        keyChoices.forEach((key, index) => {
            if (settlementResult[key]) {
                templateResult[index]++;
            }
        });
    });

    return templateResult;
}

export function processHistoryResult(historyData: historyData[], keyChoices: string[], templateResult: number[], isOtherKeyChoice = false) {
    historyData.forEach((history: any) => {
        let countDice = 0;
        const resultDices = history.result;

        keyChoices.forEach((name) => {
            if (resultDices[name]) {
                countDice++;
            }
        });

        templateResult.forEach((key, index) => {
            if (countDice === index + 1) {
                templateResult[index]++;
            }
            if (isOtherKeyChoice && countDice === index) {
                templateResult[index]++;
            }
        });
    });

    return templateResult;
}
