import { useTheme } from "next-themes";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Themes } from "../../../../common/constants";

import { CommonResourceKeys, ResourceTypes } from "../../../../common/resources";
import { useGameActionContext } from "../../../../contexts/game-actions-context";
import { PopupType } from "../../game-base/type";
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
            <div className={`game-header-button ${Styles["menu-toggle-btn"]}`} onClick={() => setDropdownOpen(!dropdownOpen)}>
                <span className={Styles[`${"icon-menu-"}${theme}`]}></span>
            </div>
            <div className="dropdown" ref={wrapperRef}>
                <div className={`dropdown-menu ${Styles["dropdown-menu"]} ${dropdownOpen ? "show" : ""}`}>
                    <span className={dropdownItemClassName}>
                        {t("darkMode")}
                        <input
                            type={"checkbox"}
                            onChange={() => {
                                theme === Themes.dark ? setTheme(Themes.light) : setTheme(Themes.dark);
                            }}
                            checked={theme === Themes.dark}
                        ></input>
                    </span>
                    <span className={dropdownItemClassName}>
                        {t("sound")}
                        <input type={"checkbox"} onChange={() => handleToggleSound()} checked={enabledSound}></input>
                    </span>
                    <span className={dropdownItemClassName} onClick={openGuide}>
                        {t(CommonResourceKeys.GUIDE_POPUP_TITLE)}
                    </span>
                </div>
            </div>
        </div>
    );
};
