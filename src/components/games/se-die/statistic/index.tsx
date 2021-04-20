import { useTranslation } from "next-i18next";
import React from "react";

import WrapperHeader, {
    handlePercentData,
    countHistoryResultIsBoolean,
    countHistoryResultNotExistKey,
    countHistorySettlement,
} from "../../../shared/statistic";
import { Props, ResultDiceRed } from "./statistic";
import SeDieDot from "../dot";
import Styles from "./statistic.module.scss";

const ChoiceOddEven = ({ data, titleText }) => {
    const { t } = useTranslation("xocxoc");
    return (
        <>
            {titleText.map((title, index) => {
                return (
                    <WrapperHeader key={"choice-oddEven-" + index}>
                        <span className={title === "odd" ? Styles["titleOdd"] : Styles["titleEven"]}> {t(title)}</span>
                        <span className={Styles["number"]}>{data[index]}%</span>
                    </WrapperHeader>
                );
            })}
        </>
    );
};

const ChoiceOther = ({ data, titleText }) => {
    return (
        <>
            {titleText.map((title, index) => {
                const value = index === 0 ? data[4] : data[index];
                return (
                    <WrapperHeader key={"choice-other-" + index}>
                        <SeDieDot red={index % 2 > 0} value={title} />
                        <span className={Styles["number"]}>{value}%</span>
                    </WrapperHeader>
                );
            })}
        </>
    );
};

const SeDiceStatistic = (props: Props) => {
    const { roundHistory } = props;
    const percentOddEven = handlePercentData(countHistorySettlement(roundHistory, ["odd", "even"], [0, 0]), [0, 0]);
    const countDiceRed = countHistoryResultIsBoolean(roundHistory, ["red1", "red2", "red3", "red4"], [0, 0, 0, 0]);
    const countDiceAllWhite = countHistoryResultNotExistKey(roundHistory);
    countDiceRed.push(+countDiceAllWhite);
    const percentOtherChoice: ResultDiceRed[] = handlePercentData(countDiceRed, [0, 0, 0, 0, 0]);
    return (
        <>
            <ChoiceOddEven data={percentOddEven} titleText={["odd", "even"]} />
            <ChoiceOther data={percentOtherChoice} titleText={[0, 1, 2, 3, 4]} />
        </>
    );
};

export default SeDiceStatistic;
