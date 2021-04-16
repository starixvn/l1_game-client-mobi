import React from "react";
import { useTranslation } from "next-i18next";
import Statistic, { handlePercentData, countHistorySettlement, WrapperHeader } from "../../../shared/statistic";
import { Props } from "./statistic";
import Styles from "./statistic.module.scss";

const Choice = ({ data, titleText }) => {
    const { t } = useTranslation("dragontiger");
    return (
        <div className={Styles["statistic-container"]}>
            {titleText.map((title, index) => {
                return (
                    <WrapperHeader key={"center-" + index}>
                        <span className={Styles["title-" + title]}> {t(title)}</span>
                        <span className={Styles["number"]}>{data[index]}%</span>
                    </WrapperHeader>
                );
            })}
        </div>
    );
};

const DragonTigerStatistic = (props: Props) => {
    const { roundHistory } = props;
    const percentOddEven = handlePercentData(countHistorySettlement(roundHistory, ["dragon", "tiger", "tie"], [0, 0, 0]), [0, 0, 0]);
    return (
        <Statistic>
            <Choice data={percentOddEven} titleText={["dragon", "tiger", "tie"]}></Choice>
        </Statistic>
    );
};

export default DragonTigerStatistic;
