import React, { useState, useMemo } from "react";

import { useGameActionContext } from "../../../contexts/game-actions-context";
import Styles from "./tabs.module.scss";

type Props = {
    tabsValue: object;
    activeScoreboardTab: number;
    customClassName?: string;
};

const ScoreboardTab: React.FunctionComponent<Props> = (props) => {
    const { tabsValue, activeScoreboardTab } = props;
    const customClassName = props.customClassName ?? "";
    const tabsKey = Object.keys(tabsValue);
    const gameActionContext = useGameActionContext();
    const [tabActive, setTabActive] = useState<number>(activeScoreboardTab);
    const classTabs = `${Styles["tabs-container"]} ${Styles[customClassName]}`;

    return useMemo(() => {
        const updateValueTab = (value: number) => {
            setTabActive(value);
            gameActionContext?.setActiveScoreboardTab && gameActionContext.setActiveScoreboardTab(value);
        };

        return (
            <div className={classTabs}>
                {tabsKey.map((tab, index) => {
                    return (
                        <div key={index} className={Styles["tabs-child"]} onClick={() => updateValueTab(index)} data-testid="tab-child">
                            {tabsValue[tab].tabWinningStreak > 3 && (
                                <span className={Styles["winning-streak"]} data-testid="winning-streak">{tabsValue[tab].tabWinningStreak}</span>
                            )}
                            <span className={`${Styles.type} ${tabActive === index ? Styles["tabs-active"] : ""}`}>
                                {tabsValue[tab].tabName}
                            </span>
                        </div>
                    );
                })}
            </div>
        );
    }, [tabActive, tabsValue]);
};

export default ScoreboardTab;
