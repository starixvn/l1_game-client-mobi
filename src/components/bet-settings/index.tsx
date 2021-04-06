import React, { useState } from "react";
import Styles from "./bet-setting.module.scss";

export const BetSettings: React.FC = (props) => {
    const [isShowSettings, setShowSettings] = useState(false);

    const HandleClickActiveBtn = () => {
        setShowSettings(!isShowSettings);
    };

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
                        <div className={Styles.chip}></div>
                        <div className={`${Styles.chip} ${Styles.highlight}`}>1</div>
                        <div className={Styles.chip}>5</div>
                        <span className={`icon-arrow-right ${Styles["next"]}`}></span>
                    </div>
                </div>
            )}
        </div>
    );
};
