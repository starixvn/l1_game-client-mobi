import React, { useState, useMemo } from "react";
import { useGameActionContext } from "../../../contexts/game-actions-context";
import Styles from "./tabs.module.scss";

type Props = {
    tabsValue: object;
    activeScoreboardTab: number;
};

const ScoreboardTab: React.FunctionComponent<Props> = (props) => {
    const { tabsValue, activeScoreboardTab } = props;
    const tabsKey = Object.keys(tabsValue);
    const gameActionContext = useGameActionContext();
    const [tabActive, setTabActive] = useState<number>(activeScoreboardTab);

    return useMemo(() => {
        const updateValueTab = (value: number) => {
            setTabActive(value);
            gameActionContext.setActiveScoreboardTab(value);
        };

        return (
            <div className="d-flex">
                <div className={Styles["tabs-container"]}>
                    {tabsKey.map((tab, index) => {
                        return (
                            <div key={index} className={Styles["tabs-child"]} onClick={() => updateValueTab(index)}>
                                {tabsValue[tab].tabWinningStreak > 3 && (
                                    <span className={Styles["winning-streak"]}>{tabsValue[tab].tabWinningStreak}</span>
                                )}
                                <span className={`${Styles.type} ${tabActive === index ? Styles["tabs-active"] : ""}`}>
                                    {tabsValue[tab].tabName}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }, [tabActive, tabsValue]);
};

export default ScoreboardTab;
