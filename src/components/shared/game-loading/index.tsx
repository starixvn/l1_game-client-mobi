import React from "react";
import Skeleton from "react-loading-skeleton";

import Styles from "./styles.module.scss";

type Props = {
    displayPopup: boolean;
    errorMessage: string | string[];
    retryConnect: () => void;
};

const GameLoading = (props: Props) => {
    const classBorder = "border-radius";
    const classScoreBoard = "score-board-line";
    const classSkeletonBackground = "skeleton-background";

    return (
        <div className={Styles.container}>
            <div className={Styles.header}>
                <div className={Styles["header-left"]}>
                    <Skeleton className={`${Styles[classBorder]} ${Styles[classSkeletonBackground]}`} width={157} />
                    <Skeleton className={`${Styles[classBorder]} ${Styles[classSkeletonBackground]}`} width={46} />
                </div>
                <Skeleton className={Styles[classSkeletonBackground]} circle={true} height={40} width={40} />
                <div className={Styles["header-right"]}>
                    <Skeleton className={`${Styles[classBorder]} ${Styles[classSkeletonBackground]}`} height={42} width={84} />
                    <Skeleton className={`${Styles[classBorder]} ${Styles[classSkeletonBackground]}`} height={42} width={14} />
                </div>
            </div>
            <div className={Styles["bet-container"]}>
                <Skeleton className={Styles[classSkeletonBackground]} height={273} />
            </div>
            <div className={Styles["mini-round-history"]}>
                <Skeleton className={`${Styles[classBorder]} ${Styles[classSkeletonBackground]}`} height={19} />
            </div>
            <div className={Styles["statistic"]}>
                <Skeleton className={`${Styles[classBorder]} ${Styles[classSkeletonBackground]}`} height={19} />
            </div>
            <div className={Styles.scoreboard}>
                <Skeleton className={`${Styles[classBorder]} ${Styles[classScoreBoard]}`} height={19} />
                <Skeleton className={`${Styles[classBorder]} ${Styles[classScoreBoard]}`} height={19} width={290} />
                <Skeleton className={`${Styles[classBorder]} ${Styles[classScoreBoard]}`} height={19} width={190} />
                <Skeleton className={`${Styles[classBorder]} ${Styles[classScoreBoard]}`} height={19} width={250} />
            </div>
        </div>
    );
};

export default GameLoading;
