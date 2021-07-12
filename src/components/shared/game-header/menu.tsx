import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { CommonResourceKeys, ResourceTypes } from "../../../common/resources";
import { useGameActionContext } from "../../../contexts/game-actions-context";
import { PopupType } from "../game-base/type";
import Styles from "./menu.module.scss";

const hamburgerDotClassName = "hamburger-dot";
const dropdownItemClassName = "dropdown-item";

export default function Menu() {
    const { t } = useTranslation([ResourceTypes.COMMON]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { openPopup } = useGameActionContext();

    const toggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setDropdownOpen((prevState) => !prevState);
    };

    const openBetHistory = () => {
        openPopup(PopupType.BetHistory);
    };

    const openGuide = () => {
        openPopup(PopupType.Guide);
    };

    return (
        <div className="dropdown">
            <div className={`dropdown-toggle ${Styles["dropdown-toggle"]}`} onClick={toggle}>
                <div className={Styles[hamburgerDotClassName]}></div>
                <div className={Styles[hamburgerDotClassName]}></div>
                <div className={Styles[hamburgerDotClassName]}></div>
            </div>
            <div className={`dropdown-menu ${Styles["dropdown-menu"]} ${dropdownOpen ? "show" : ""}`}>
                <span className={dropdownItemClassName} onClick={openBetHistory}>
                    {t(CommonResourceKeys.HISTORY_POPUP_TITLE)}
                </span>
                <span className={dropdownItemClassName} onClick={openGuide}>
                    {t(CommonResourceKeys.GUIDE_POPUP_TITLE)}
                </span>
            </div>
        </div>
    );
}
