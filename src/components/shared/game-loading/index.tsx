import React from "react";
import { ViewMode } from "../game-base/type";
import Styles from "./styles.module.scss";

const GameLoading: React.FC<{}> = () => {
    const classBorder = "border-radius";
    const classScoreBoard = "score-board-line";
    const classSkeletonBackground = "skeleton-background";

    return (
        <div className={Styles.container}>
            <div className={Styles.header}>
                <div className={Styles["header-left"]}>
                    <span className={`${Styles[classBorder]} ${Styles[classSkeletonBackground]}`} />
                    <span className={`${Styles[classBorder]} ${Styles[classSkeletonBackground]}`} />
                </div>
                <span className={`${Styles[classSkeletonBackground]} ${Styles["skeleton-circle"]}`} />
                <div className={Styles["header-right"]}>
                    <span className={`${Styles[classBorder]} ${Styles[classSkeletonBackground]}`} />
                    <span className={`${Styles[classBorder]} ${Styles[classSkeletonBackground]}`} />
                </div>
            </div>
            <div className={Styles["bet-container"]}>
                <span className={Styles[classSkeletonBackground]} />
            </div>
            <div className={Styles["mini-round-history"]}>
                <span className={`${Styles[classBorder]} ${Styles[classSkeletonBackground]}`} />
            </div>
            <div className={Styles["statistic"]}>
                <span className={`${Styles[classBorder]} ${Styles[classSkeletonBackground]}`} />
            </div>
            <div className={Styles.scoreboard}>
                <span className={`${Styles[classBorder]} ${Styles[classScoreBoard]}`} />
                <span className={`${Styles[classBorder]} ${Styles[classScoreBoard]}`} />
                <span className={`${Styles[classBorder]} ${Styles[classScoreBoard]}`} />
                <span className={`${Styles[classBorder]} ${Styles[classScoreBoard]}`} />
            </div>
        </div>
    );
};

export default GameLoading;
