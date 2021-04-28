import React from "react";
import { useTranslation } from "react-i18next";

import { CommonResourceKeys, ResourceTypes } from "../../../common/resources";
import Styles from "./locking-bet.module.scss";

const LockingBet: React.FC = () => {
    const { t } = useTranslation(ResourceTypes.COMMON);
    return (
        <div className="overlay-mask-white">
            <div className={Styles["mini-notice"]}>{t(CommonResourceKeys.LOCKING_BET)}</div>
        </div>
    );
};

export default LockingBet;
