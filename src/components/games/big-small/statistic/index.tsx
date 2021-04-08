import { useTranslation } from "next-i18next";
import React from "react";

import Statistic, { processHistorySettlement, WrapperHeader } from "../../../shared/statistic";
import { StatisticType } from "../../../shared/statistic/statistic";
import { Props } from "./statistic";
import Styles from "./statistic.module.scss";

const Element = ({ data, titleText }) => {
    const { t } = useTranslation("taixiu");
    return (
        <div className={Styles["element-container"]}>
            {titleText.map((title, index) => {
                const value = data[index];
                return (
                    <WrapperHeader key={"center-" + index}>
                        <span className={title === "big" ? "titleBig" : "titleSmall"}> {t(title)}</span>
                        <span className={Styles["number"]}>{value}%</span>
                    </WrapperHeader>
                );
            })}
        </div>
    );
};

const BigSmallStatistic = (props: Props) => {
    const { roundHistory } = props;
    const dataStatistic: StatisticType = {
        settlementResult: [0, 0],
    };
    dataStatistic.settlementResult = processHistorySettlement(roundHistory, ["big", "small"], dataStatistic.settlementResult);
    const titleTextLeft = ["big", "small"];
    return (
        <div>
            <Statistic>
                <Element data={dataStatistic.settlementResult} titleText={titleTextLeft}></Element>
            </Statistic>
        </div>
    );
};

export default BigSmallStatistic;
