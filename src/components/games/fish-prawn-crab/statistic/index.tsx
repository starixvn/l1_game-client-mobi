import React from "react";
import Styles from "./statistic.module.scss";
import Item from "../item";
import { processHistoryResultNumber } from "../../../shared/statistic";
import BaseResult from "../fish-prawn-crab";

type Props = {
    roundHistory: any;
};

const Element = ({ type, value }) => {
    return (
        <div className={Styles.container}>
            <Item type={type} isSmall={true}></Item>
            <span className={Styles.number}>{value}</span>
        </div>
    );
};

const StatisticComponent = (props: Props) => {
    const { roundHistory } = props;
    const tmpData = [0, 0, 0, 0, 0, 0];
    const result = processHistoryResultNumber(roundHistory, tmpData);
    return (
        <div className={Styles.layout}>
            {result.map((value, index) => {
                return <Element type={index} value={value}></Element>;
            })}
        </div>
    );
};

export default StatisticComponent;
