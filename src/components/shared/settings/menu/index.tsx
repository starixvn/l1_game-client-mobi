import { useTheme } from "next-themes";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Themes } from "../../../../common/constants";

import { CommonResourceKeys, ResourceTypes } from "../../../../common/resources";
import Styles from "./menu.module.scss";

const dropdownItemClassName = "dropdown-item";

export const Menu: React.FC<{ handleToggleSound: Function; enabledSound: boolean }> = ({ handleToggleSound, enabledSound }) => {
    const { t } = useTranslation([ResourceTypes.COMMON]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const { theme, setTheme } = useTheme();

    const openGuide = () => {
        setDropdownOpen(false);
    };

    const handleClickOutside = (event) => {
        if (wrapperRef && wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            setDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    return (
        <div className={Styles["game-menu"]}>
            <div
                className={`header-button ${Styles["menu-toggle-btn"]}`}
                onClick={() => {
                    setDropdownOpen(!dropdownOpen);
                }}
            >
                <span className={Styles[`${"icon-menu-"}${theme}`]}></span>
            </div>
            <div className="dropdown" ref={wrapperRef}>
                <div className={`dropdown-menu ${Styles["dropdown-menu"]} ${dropdownOpen ? "show" : ""}`}>
                    <div className={`${dropdownItemClassName} ${Styles[dropdownItemClassName]}`}>
                        <div className={Styles["label"]}>{t("darkMode")}</div>
                        <div className={Styles["toggle-button"]}>
                            <input
                                className={Styles["toggle-checkbox"]}
                                id="toggle-themes"
                                type={"checkbox"}
                                onChange={() => {
                                    theme === Themes.dark ? setTheme(Themes.light) : setTheme(Themes.dark);
                                }}
                                checked={theme === Themes.dark}
                            />
                            <label className={Styles["toggle-btn"]} htmlFor="toggle-themes"></label>
                        </div>
                    </div>
                    <div className={`${dropdownItemClassName} ${Styles[dropdownItemClassName]}`}>
                        <div className={Styles["label"]}>{t("sound")}</div>
                        <div className={Styles["toggle-button"]}>
                            <input
                                id="toggle-sound"
                                className={Styles["toggle-checkbox"]}
                                type={"checkbox"}
                                onChange={() => handleToggleSound()}
                                checked={enabledSound}
                            />
                            <label className={Styles["toggle-btn"]} htmlFor="toggle-sound"></label>
                        </div>
                    </div>
                    <div className={`${dropdownItemClassName} ${Styles[dropdownItemClassName]}`} onClick={openGuide}>
                        {t(CommonResourceKeys.GUIDE_POPUP_TITLE)}
                    </div>
                </div>
            </div>
        </div>
    );
};
