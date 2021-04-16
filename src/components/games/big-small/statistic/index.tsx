import React from "react";
import { useTranslation } from "next-i18next";
import WrapperHeader, { handlePercentData, countHistorySettlement } from "../../../shared/statistic";
import { Props } from "./statistic";
import Styles from "./statistic.module.scss";

const BigSmallStatistic = (props: Props) => {
    const { roundHistory } = props;
    const { t } = useTranslation("taixiu");
    const percentOddEven = handlePercentData(countHistorySettlement(roundHistory, ["big", "small"], [0, 0]), [0, 0]);
    return (
        <>
            {["big", "small"].map((title, index) => {
                return (
                    <WrapperHeader key={"center-" + index}>
                        <span className={title === "big" ? Styles["titleBig"] : Styles["titleSmall"]}> {t(title)}</span>
                        <span className={Styles["number"]}>{percentOddEven[index]}%</span>
                    </WrapperHeader>
                );
            })}
        </>
    );
};

export default BigSmallStatistic;
