import React from "react";
import Skeleton from "react-loading-skeleton";

import Styles from "./styles.module.scss";

const GameLoading = () => {
    return (
        <div className={Styles.container}>
            <div className={Styles.header}>
                <div className={Styles["header-left"]}>
                    <Skeleton width={100} />
                    <Skeleton width={80} />
                </div>
                <Skeleton circle={true} height={50} width={50} />
                <div className={Styles["header-right"]}>
                    <Skeleton className={Styles.rebet} />
                    <Skeleton className={Styles.button} />
                </div>
            </div>
            <div className={Styles["bet-container"]}>
                <Skeleton height={285} />
            </div>
            <div className={Styles.bottom}>
                <Skeleton count={8} />
            </div>
        </div>
    );
};

export default GameLoading;
