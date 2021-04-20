import { useTranslation } from "next-i18next";
import React from "react";

import { CommonResourceKeys, ResourceTypes } from "../../../common/resources";
import Styles from "./balanced-betting-pool.module.scss";

const BalancedBettingPool = () => {
    const { t } = useTranslation(ResourceTypes.COMMON);
    return (
        <div className={Styles["balanced-betting-pool-container"]}>
            <div className={Styles["balanced-betting-pool-content"]}>{t(CommonResourceKeys.BALANCED_BETTING_POOL)}</div>
        </div>
    );
};

export default BalancedBettingPool;
