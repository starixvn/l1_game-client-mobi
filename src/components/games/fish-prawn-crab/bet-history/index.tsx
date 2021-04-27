import React from "react";
import { useTranslation } from "next-i18next";
import BetHistoryContainer from "../../../shared/bet-history";
import { BetLogs, Odds } from "./bet-history";
import { OddNames, ResultBet } from "../index";
import ChoiceIcon from "../choice-icon";

const renderResult = (bet: BetLogs) => {
    if (bet.result) {
        const itemValues = Object.values(bet.result);
        return (
            <div className="d-flex justify-content-center">
                {itemValues.map((value: number, index) => {
                    return <ChoiceIcon key={index} type={value} isSmall={true}></ChoiceIcon>;
                })}
            </div>
        );
    }
    return <></>;
};

const renderOdd = (choice: string, countsAppearDice: object, odds: Odds) => {
    let classCount = `@${odds[OddNames.single]}`;
    Object.keys(countsAppearDice).forEach((number) => {
        if (+ResultBet[choice] === +number) {
            if (+countsAppearDice[number] === 2) {
                classCount = `@${odds[OddNames.double]}`;
                return;
            }

            if (+countsAppearDice[number] === 3) {
                classCount = `@${odds[OddNames.triple]}`;
                return;
            }
        }
    });

    return classCount;
};

const renderBet = (bet: any, t: Function, mainOdds: object) => {
    if (bet.settlementResult && bet.result) {
        const keysChoices = Object.keys(bet.settlementResult);
        const odds = bet.odds ? bet.odds : mainOdds;
        const countsAppearDice = {};
        Object.values(bet.result).forEach((value) => {
            countsAppearDice[+value] = (countsAppearDice[+value] || 0) + 1;
        });
        return (
            <>
                {keysChoices &&
                    keysChoices.map((choice, index) => {
                        const classHighLight = bet.settlementResult[choice] ? "font-weight-medium" : "";
                        if (bet[choice] > 0) {
                            if (ResultBet[choice])
                                return (
                                    <div key={index} className={classHighLight}>
                                        {t(choice)}
                                        {renderOdd(choice, countsAppearDice, odds)}
                                    </div>
                                );
                        }
                        return "";
                    })}
            </>
        );
    }

    return <></>;
};

const FishPrawnCrabBetHistory: React.FunctionComponent = () => {
    const { t } = useTranslation("baucua");
    return (
        <BetHistoryContainer
            isRefund={false}
            renderResult={(bet: BetLogs) => renderResult(bet)}
            translate={t}
            renderBet={(bet: BetLogs, t: Function, mainOdds: object) => renderBet(bet, t, mainOdds)}
        ></BetHistoryContainer>
    );
};

export default FishPrawnCrabBetHistory;
