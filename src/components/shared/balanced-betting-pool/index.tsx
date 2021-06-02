import { useTranslation } from "next-i18next";
import React from "react";

import { MessageResourceKeys, ResourceTypes } from "../../../common/resources";
import Styles from "./balanced-betting-pool.module.scss";

const BalancedBettingPool = () => {
    const { t } = useTranslation(ResourceTypes.MESSAGES);
    return (
        <div className="overlay-mask-no-bg">
            <div className={Styles["balanced-betting-pool-content"]}>{t(MessageResourceKeys.BALANCED_BETTING_POOL)}</div>
        </div>
    );
};

export default BalancedBettingPool;
