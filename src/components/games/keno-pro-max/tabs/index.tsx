import { useTranslation } from "next-i18next";
import React, { useState, useEffect, useMemo } from "react";
import { useGameActionContext } from "../../../../contexts/game-actions-context";
import Styles from "./tabs.module.scss";

enum TabsValue {
    bigSmall,
    oddEven,
    fiveElement,
}

const TabsComponent: React.FunctionComponent = () => {
    const gameActionContext = useGameActionContext();
    const [tabValue, setTabValue] = useState<number>(TabsValue.bigSmall);
    const { t } = useTranslation("kenopromax");

    return useMemo(() => {
        const updateValueTab = (value: number) => {
            setTabValue(value);
            gameActionContext.setTabsScoreboardValue(value);
        };

        return (
            <div className="d-flex">
                <div className={Styles["tabs-container"]}>
                    <div className={Styles["tabs-child"]} onClick={() => updateValueTab(TabsValue.bigSmall)}>
                        <span className={`${Styles.type} ${tabValue === TabsValue.bigSmall ? Styles["tabs-active"] : ""}`}>
                            {t("big")}/{t("small")}
                        </span>
                    </div>
                    <div className={Styles["tabs-child"]} onClick={() => updateValueTab(TabsValue.oddEven)}>
                        <span className={`${Styles.type} ${tabValue === TabsValue.oddEven ? Styles["tabs-active"] : ""}`}>
                            {t("even")}/{t("odd")}
                        </span>
                    </div>
                    <div className={Styles["tabs-child"]} onClick={() => updateValueTab(TabsValue.fiveElement)}>
                        <span className={`${Styles.type} ${tabValue === TabsValue.fiveElement ? Styles["tabs-active"] : ""}`}>
                            {t("fiveElements")}
                        </span>
                    </div>
                </div>
            </div>
        );
    }, [tabValue]);
};

export default TabsComponent;
