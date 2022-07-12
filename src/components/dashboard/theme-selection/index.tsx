import { useTranslation } from "next-i18next";
import { useTheme } from "next-themes";
import React from "react";

import { Themes } from "../../../common/constants";
import Styles from "./theme-selection.module.scss";

const ThemeSelection = () => {
    const { t } = useTranslation("common");
    const { theme, setTheme } = useTheme();

    return (
        <div className={Styles["theme-container"]}>
            <div className={Styles["theme-select-title"]}>{t("common:selectTheme")}</div>
            <div className={Styles["theme-list"]}>
                <div className={Styles["theme"]}>
                    <div className={`${Styles["theme-light-icon"]}`} onClick={() => setTheme(Themes.light)} data-testid="btn-light">
                        <span className={Styles["line1"]}></span>
                        <span className={Styles["line2"]}></span>
                    </div>
                    <div>
                        <input
                            id="theme-light"
                            type="radio"
                            name="theme"
                            checked={theme === Themes.light}
                            onChange={() => setTheme(Themes.light)}
                            className={Styles["radio-button"]}
                            data-testid="checked-light"
                        />
                        <label className={Styles["radio-label"]} htmlFor="theme-light">
                            {t("light")}
                        </label>
                    </div>
                </div>                
            </div>
        </div>
    );
};

export default ThemeSelection;
