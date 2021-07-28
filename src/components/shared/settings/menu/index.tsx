import { useTheme } from "next-themes";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Themes } from "../../../../common/constants";

import { CommonResourceKeys, ResourceTypes } from "../../../../common/resources";
import { Tooltip } from "../../tooltip";
import Styles from "./menu.module.scss";

const dropdownItemClassName = "dropdown-item";

export const Menu: React.FC<{
    handleToggleSound: Function;
    enabledSound: boolean;
    handleToggleGuideModal: Function;
    toggleFavoriteSetting: Function;
}> = ({ handleToggleSound, enabledSound, handleToggleGuideModal, toggleFavoriteSetting }) => {
    const { t } = useTranslation([ResourceTypes.COMMON]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const toggleBtnRef = useRef<HTMLDivElement>(null);
    const { theme, setTheme } = useTheme();

    const openGuide = () => {
        handleToggleGuideModal();
        setDropdownOpen(false);
    };

    const openFavoriteSetting = () => {
        toggleFavoriteSetting();
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
        <div className={Styles["game-menu"]} ref={wrapperRef}>
            <div
                ref={toggleBtnRef}
                className={`header-button ${Styles["menu-toggle-btn"]}`}
                onClick={() => {
                    setDropdownOpen(!dropdownOpen);
                }}
            >
                <span className={Styles[`${"icon-menu-"}${theme}`]}></span>
                <Tooltip message="Menu" hoverWrapper={toggleBtnRef}></Tooltip>
            </div>
            <div className="dropdown">
                <div className={`dropdown-menu right ${Styles["dropdown-menu"]} ${dropdownOpen ? "show" : ""}`}>
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
                    <div className={`${dropdownItemClassName} ${Styles[dropdownItemClassName]}`} onClick={openFavoriteSetting}>
                        {t(CommonResourceKeys.FAVORITE_SETTING)}
                    </div>
                </div>
            </div>
        </div>
    );
};
