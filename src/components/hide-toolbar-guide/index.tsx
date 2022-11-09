import React, { useEffect, useRef, useState } from "react";
import { Trans, useTranslation } from "next-i18next";
import { isMobileOnly, isIOS } from "react-device-detect";
import { useAuthContext } from "../../contexts/auth";
import Styles from "./hide-toolbar-guide.module.scss";

export const HideToolbarGuide: React.FC<{}> = ({}) => {
    const [isShowModalConfirm, setIsShowPopup] = useState(false);
    const [isShowTooltip, setIsShowTooltip] = useState(true);
    const tooltipRef = useRef<HTMLDivElement>(null);
    let deviceClass = "";
    if (isMobileOnly) {
        deviceClass = isIOS ? Styles["ios-device"] : Styles["android-device"];
    }
    const authContext = useAuthContext();
    const { t } = useTranslation();    

    const handleTurnOn = () => {
        setIsShowTooltip(false);        
    };

    const closeHintTooltip = () => {
        setIsShowTooltip(false);        
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (isShowTooltip && tooltipRef && tooltipRef.current && !tooltipRef.current.contains(event.target)) {
                setIsShowTooltip(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [tooltipRef]);

    return (
        <div className={`${Styles["hide-guide-container"]}`}>
            <div className={Styles["intro"]}>
                <div>For a</div>
                <div>Fullscreen experience</div>
                <div>tap <strong>Hide Toolbar</strong></div>
            </div>
            <div className={Styles["anim-container"]}>

            </div>
            <div className={Styles["button-action"]}>
                <button className={`btn-grey ${Styles["btn"]}`} onClick={closeHintTooltip}>
                    {t("common:close")}
                </button>
                <button className={`btn-red ${Styles["btn"]}`} onClick={handleTurnOn}>
                    {t("common:do-not-show-again")}
                </button>
            </div>
        </div>
    )
};