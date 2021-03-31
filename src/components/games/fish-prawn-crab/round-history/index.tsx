import React from "react";
import Styles from "./history-round.module.scss";
import { StatisticItem } from "../../../shared/round-history/type";
import { Result, SettlementResult } from "./../fish-prawn-crab";
import { useTranslation } from "next-i18next";
import RoundHistory from "../../../shared/round-history/scoreboard";
import { Props } from "./round-history";
// import SeDiceStatistic from "../statistic";

export const typeDiceResult = ["dice1", "dice2", "dice3"];

const getElementRound = (data: StatisticItem, roundId: number) => {
    const items = data.type.map((item) => {
        return <div className={Styles[item.class]}></div>;
    });
    return (
        <div key={roundId} className={Styles.round}>
            {items}
        </div>
    );
};

const FishPrawnCrabHistory = (props: Props) => {
    const { roundHistory, gameState } = props;
    return (
        <div className={Styles.container}>
            {/* <SeDiceStatistic roundHistory={roundHistory}></SeDiceStatistic> */}
            {/* <RoundHistory
                roundHistory={roundHistory}
                gameState={gameState}
                getElementRound={getElementRound}
            ></RoundHistory> */}
            {/* <div className={Styles.round}>
                <div className={`${Styles.icon} icon-tom`}></div>
                <div className={`${Styles.icon} icon-bau`}></div>
                <div className={`${Styles.icon} icon-ca`}></div>
            </div>

            <div className={Styles.round}>
                <div className={`${Styles.icon} icon-ga`}></div>
                <div className={`${Styles.icon} icon-bau`}></div>
                <div className={`${Styles.icon} icon-nai`}></div>
            </div>

            <div className={`${Styles.round} ${Styles.latest} `}>
                <div className={`${Styles.icon} icon-ga`}></div>
                <div className={`${Styles.icon} icon-bau`}></div>
                <div className={`${Styles.icon} icon-nai`}></div>
            </div> */}
        </div>
    );
};

export default FishPrawnCrabHistory;
