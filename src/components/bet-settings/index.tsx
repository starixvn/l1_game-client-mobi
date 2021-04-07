import React, { useState } from "react";

import Chip from "../chip";
import Styles from "./bet-setting.module.scss";

export const BetSettings: React.FC = (props) => {
    const [isShowSettings, setShowSettings] = useState(false);
    const [selectedChipValue, setSelectedChipValue] = useState(1);

    const HandleClickActiveBtn = () => {
        setShowSettings(!isShowSettings);
    };

    const chipList = { "1": 1, "5": 5, "10": 10, "50": 50, "100": 100, "200": 200, "500": 500, "1k": 1000, "2k": 2000 };

    return (
        <div>
            <div className={Styles["betting-setting-collapsed"]} onClick={HandleClickActiveBtn}>
                <span className={`icon-arrow2-right ${Styles["expand-icon"]}`}></span>
                <img src="/static/images/chip-reset.png" alt="chip" className="img-fluid" />
            </div>
            {isShowSettings && (
                <div className={Styles["settings-container"]}>
                    <div className={Styles["toggle"]}>
                        <input className={Styles["toggle-checkbox"]} id="toggle-quickbet" type={"checkbox"} value={"Quick Bet"} />
                        <label className={Styles["toggle-btn"]} htmlFor="toggle-quickbet">
                            <span className={`icon-quick-bet ${Styles["toggle-feature"]}`}></span>
                        </label>
                    </div>

                    <div className={Styles["chips-container"]}>
                        <span className={`icon-arrow-right ${Styles["prev"]} ${Styles["disabled"]}`}></span>
                        {Object.keys(chipList).map((key) => (
                            <Chip
                                key={key}
                                display={key}
                                value={chipList[key]}
                                onSelected={setSelectedChipValue}
                                selected={selectedChipValue === chipList[key]}
                            />
                        ))}
                        <span className={`icon-arrow-right ${Styles["next"]}`}></span>
                    </div>
                </div>
            )}
        </div>
    );
};
