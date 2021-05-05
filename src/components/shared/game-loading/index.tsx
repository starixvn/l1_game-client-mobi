import React from "react";
import Skeleton from "react-loading-skeleton";

import Styles from "./styles.module.scss";

const GameLoading = () => {
    return (
        <div className={Styles.container}>
            <div className={Styles.header}>
                <div className={Styles["header-left"]}>
                    <Skeleton width={100} />
                    <Skeleton width={40} />
                </div>
                <Skeleton circle={true} height={40} width={40} />
                <div className={Styles["header-right"]}>
                    <Skeleton className={Styles.rebet} />
                    <Skeleton className={Styles.button} />
                </div>
            </div>
            <div className={Styles["bet-container"]}>
                <Skeleton height={285} />
            </div>
            <div className={Styles["mini-round-history"]}>
                <Skeleton className={Styles["border-radius"]} height={22} />
            </div>
            <div className={Styles["statistic"]}>
                <Skeleton className={Styles["border-radius"]} height={19} />
            </div>
            <div className={Styles.scoreboard}>
                <Skeleton className={`${Styles["border-radius"]} ${Styles["score-board-line"]}`} height={19} />
                <Skeleton className={`${Styles["border-radius"]} ${Styles["score-board-line"]}`} height={19} width={290} />
                <Skeleton className={`${Styles["border-radius"]} ${Styles["score-board-line"]}`} height={19} width={190} />
                <Skeleton className={`${Styles["border-radius"]} ${Styles["score-board-line"]}`} height={19} width={250} />
            </div>
        </div>
    );
};

export default GameLoading;
