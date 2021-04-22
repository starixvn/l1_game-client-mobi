import { useTranslation } from "next-i18next";
import React from "react";

import WrapperHeader, {
    handlePercent,
    countResultWithValueBoolean,
    countResultNotExistKey,
    countSettlement,
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
                    <WrapperHeader key={index}>
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
                return (
                    <WrapperHeader key={index}>
                        <SeDieDot red={index % 2 > 0} value={title} />
                        <span className={Styles["number"]}>{data[index]}%</span>
                    </WrapperHeader>
                );
            })}
        </>
    );
};

const SeDiceStatistic = (props: Props) => {
    const { roundHistory } = props;
    const percentOddEven = handlePercent(countSettlement(roundHistory, ["odd", "even"], [0, 0]), [0, 0]);
    const countDiceRed = countResultWithValueBoolean(roundHistory, ["red1", "red2", "red3", "red4"], [0, 0, 0, 0]);
    const countDiceAllWhite = countResultNotExistKey(roundHistory);
    countDiceRed.unshift(+countDiceAllWhite);
    const percentOtherChoice: ResultDiceRed[] = handlePercent(countDiceRed, [0, 0, 0, 0, 0]);
    return (
        <>
            <ChoiceOddEven data={percentOddEven} titleText={["odd", "even"]} />
            <ChoiceOther data={percentOtherChoice} titleText={[0, 1, 2, 3, 4]} />
        </>
    );
};

export default SeDiceStatistic;
