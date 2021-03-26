import { useTranslation } from 'next-i18next';
import React from 'react';

import Statistic, {
    handlePercentData,
    processHistoryResult,
    processHistorySettlement,
    WrapperHeader,
} from '../../../shared/statistic';
import { StatisticType } from '../../../shared/statistic/statistic';
import DotStyles from '../dot/dot.module.scss';
import { Props, ResultDiceRed } from './statistic';
import Styles from './statistic.module.scss';

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
                const classString = index % 2 ? DotStyles["dot-red"] : DotStyles["dot-white"];
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
