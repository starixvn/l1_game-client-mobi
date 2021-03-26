import React from "react";
import Styles from "./statistic.module.scss";
import { handlePercentData, processHistorySettlement, processHistoryResult } from "../../../shared/statistic";
import { StatisticType } from "../../../shared/statistic/statistic";
import { Props, ResultDiceRed } from "./statistic";
import Statistic, { WrapperHeader } from "../../../shared/statistic";
import { useTranslation } from "next-i18next";

const ElementLeft = ({ data, titleText }) => {
    return (
        <div className={Styles["percent-left"]}>
            {titleText.map((title, index) => {
                const value = data[index];
                return <Element classString={Styles["titleOdd"]} title={title} value={value}></Element>;
            })}
        </div>
    );
};

const Element = ({ classString, title, value }) => {
    const { t } = useTranslation("xocxoc");
    return (
        <WrapperHeader>
            <span className={classString}> {t(title)}</span>
            <span className={Styles["number"]}>{value}%</span>
        </WrapperHeader>
    );
};

const ElementRight = ({ data, titleText }) => {
    return (
        <div className={Styles["percent-right"]}>
            {titleText.map((title, index) => {
                const classString = index % 2 ? Styles["title-red"] : Styles["title-white"];
                const value = index === 0 ? data[4] : data[index];
                return <Element classString={classString} title={title} value={value}></Element>;
            })}
        </div>
    );
};

const SeDiceStatistic = (props: Props) => {
    const { roundHistory } = props;
    const dataStatistic: StatisticType = {
        settlementResult: [0, 0],
        result: [0, 0, 0, 0, 0],
    };
    dataStatistic.settlementResult = processHistorySettlement(roundHistory, ["odd", "even"], dataStatistic.settlementResult);
    dataStatistic.result = processHistoryResult(roundHistory, ["red1", "red2", "red3", "red4"], dataStatistic.result, true);
    let resultPercentDice: ResultDiceRed[] = [0, 0, 0, 0, 0];
    resultPercentDice = handlePercentData(dataStatistic.result, resultPercentDice);
    const titleTextRight = [0, 1, 2, 3, 4];
    const titleTextLeft = ["odd", "even"];
    return (
        <div>
            <Statistic>
                <ElementLeft data={dataStatistic.settlementResult} titleText={titleTextLeft}></ElementLeft>
                <ElementRight data={resultPercentDice} titleText={titleTextRight}></ElementRight>
            </Statistic>
        </div>
    );
};

export default SeDiceStatistic;
