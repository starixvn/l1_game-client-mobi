import React from "react";
import { useTranslation } from "next-i18next";
import WrapperHeader, { handlePercentData, countHistorySettlement } from "../../../shared/statistic";
import { Props } from "./statistic";
import Styles from "./statistic.module.scss";

const DragonTigerStatistic = (props: Props) => {
    const { roundHistory } = props;
    const { t } = useTranslation("dragontiger");
    const percentOddEven = handlePercentData(countHistorySettlement(roundHistory, ["dragon", "tiger", "tie"], [0, 0, 0]), [0, 0, 0]);
    return (
        <>
            {["dragon", "tiger", "tie"].map((title, index) => {
                return (
                    <WrapperHeader key={index}>
                        <span className={Styles["title-" + title]}> {t(title)}</span>
                        <span className={Styles["number"]}>{percentOddEven[index]}%</span>
                    </WrapperHeader>
                );
            })}
        </>
    );
};

export default DragonTigerStatistic;
