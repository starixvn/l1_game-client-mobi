import { useTranslation } from "next-i18next";
import React, { useState, useEffect, useMemo } from "react";
import { useGameActionContext } from "../../../../contexts/game-actions-context";
import Styles from "./tabs.module.scss";
import { useGameContext } from "../../../../contexts/game-context/game-context";

export enum TabsValue {
    redBlack,
    suits,
}

const TabsComponent: React.FunctionComponent = () => {
    const gameActionContext = useGameActionContext();
    const [tabValue, setTabValue] = useState<number>(TabsValue.redBlack);
    const { gameSetting } = useGameContext();
    const { t } = useTranslation(gameSetting.gameName.toLowerCase());

    return useMemo(() => {
        const updateValueTab = (value: number) => {
            setTabValue(value);
            gameActionContext.setTabsScoreboardValue(value);
        };

        return (
            <div>
                <div className={Styles["tabs-container"]}>
                    <div className={Styles["tabs-child"]} onClick={() => updateValueTab(TabsValue.redBlack)}>
                        <span className={`${Styles.type} ${tabValue === TabsValue.redBlack ? Styles["tabs-active"] : ""}`}>
                            {t("red")}/{t("black")}
                        </span>
                    </div>
                    <div className={Styles["tabs-child"]} onClick={() => updateValueTab(TabsValue.suits)}>
                        <span className={`${Styles.type} ${tabValue === TabsValue.suits ? Styles["tabs-active"] : ""}`}>{t("suits")}</span>
                    </div>
                </div>
            </div>
        );
    }, [tabValue]);
};

export default TabsComponent;
