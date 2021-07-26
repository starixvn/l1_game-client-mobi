import { useTranslation } from "next-i18next";
import React, { useState, useEffect, useMemo } from "react";
import { useGameActionContext } from "../../../../contexts/game-actions-context";
import Styles from "./tabs.module.scss";

enum TabsValue {
    playerBanKer,
    bigSmall,
}

const TabsComponent: React.FunctionComponent = () => {
    const gameActionContext = useGameActionContext();
    const [tabValue, setTabValue] = useState<number>(TabsValue.playerBanKer);
    const { t } = useTranslation("baccarat");

    return useMemo(() => {
        const updateValueTab = (value: number) => {
            setTabValue(value);
            gameActionContext.setTabsScoreboardValue(value);
        };

        return (
            <div className="d-flex">
                <div className={Styles["tabs-container"]}>
                    <div className={Styles["tabs-child"]} onClick={() => updateValueTab(TabsValue.playerBanKer)}>
                        <span className={`${Styles.type} ${tabValue === TabsValue.playerBanKer ? Styles["tabs-active"] : ""}`}>
                            {t("player")}/{t("banker")}
                        </span>
                    </div>
                    <div className={Styles["tabs-child"]} onClick={() => updateValueTab(TabsValue.bigSmall)}>
                        <span className={`${Styles.type} ${tabValue === TabsValue.bigSmall ? Styles["tabs-active"] : ""}`}>
                            {t("big")} {t("small")}
                        </span>
                    </div>
                </div>
            </div>
        );
    }, [tabValue, gameActionContext, t]);
};

export default TabsComponent;
