import React from "react";
import Styles from "./statistic.module.scss";
import Item from "../item";
import { countHistoryResultIsNumber } from "../../../shared/statistic";

type Props = {
    roundHistory: any;
};

const StatisticComponent = (props: Props) => {
    const { roundHistory } = props;
    const result = countHistoryResultIsNumber(roundHistory, [0, 0, 0, 0, 0, 0]);
    return (
        <>
            {result.map((value, index) => {
                return (
                    <div key={index} className={Styles["odd-group"]}>
                        <Item type={index} isSmall={true}></Item>
                        <span>{value}</span>
                    </div>
                );
            })}
        </>
    );
};

export default StatisticComponent;
