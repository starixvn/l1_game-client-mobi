import React from "react";
import { useTranslation } from "next-i18next";

import { HalfRoundSettlementProps } from "./main-frame-result-props";
import Styles from "./main-frame-result.module.scss";
import { buildHalfMatchProps } from "../keno-match-helper";

const HalfRoundSettlement = ({ gameName, settlementResult, isActiveLiveFullTime }: HalfRoundSettlementProps) => {
    const { t } = useTranslation(gameName),
    props = {
        settlementResult,
        ...buildHalfMatchProps(isActiveLiveFullTime),
    };

    if (settlementResult === undefined) {
        return <></>;
    }

    return (
        <div className={`${Styles["half-round-settlement"]}`}>
            <div className={Styles["header"]}>{t(props.headerText)}</div>
            <div className={Styles["result-info"]}>
                {Object.keys(settlementResult).map((keyName, index) => {
                    if (settlementResult[keyName] && ["blue", "red"].includes(keyName)) {
                        return (
                            <div key={index} className={Styles[`result-info-${keyName}`]}>
                                {t(keyName)}
                            </div>
                        );
                    }
                })}
            </div>
            <div className={Styles["result-info"]}>
                {Object.keys(settlementResult).map((keyName, index) => {
                    if (settlementResult[keyName] && ["odd", "even", "over", "under"].includes(keyName)) {
                        return (
                            <div key={index} className={Styles["result-info-red"]}>
                                {t(keyName)}
                            </div>
                        );
                    }
                })}
            </div>
        </div>
    );
};

export default HalfRoundSettlement;
