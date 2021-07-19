import React, { useEffect, useRef, useState } from "react";
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
    const wrapperRef = useRef<HTMLDivElement>(null);

    const toggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setDropdownOpen(!dropdownOpen);
    };

    const openBetHistory = () => {
        openPopup(PopupType.BetHistory);
        setDropdownOpen(false);
    };

    const openGuide = () => {
        openPopup(PopupType.Guide);
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
        <div className="dropdown" onClick={toggle} ref={wrapperRef}>
            <div className={`dropdown-toggle ${Styles["dropdown-toggle"]}`}>
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
