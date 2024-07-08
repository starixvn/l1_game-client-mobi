import React, { useEffect, useMemo, useState } from "react";
import Styles from "./hide-toolbar-guide.module.scss";
import { buildVersion } from "../../common/constants";
import { useTranslation } from "next-i18next";
import { isMobileOnly, isSafari } from "react-device-detect";
import { localStorageKeys, storeLocalStorageItem } from "../../common/local-storage";

const ToolbarIcon = ({ name }) => {
    return <img src={`/static/images/hide-toolbar-guide/${name}.svg?v=${buildVersion}`} alt={name} />;
};

export const ToolbarGuide: React.FC<{ isShowToolbarGuide: boolean; onCloseGuide: Function }> = ({ isShowToolbarGuide, onCloseGuide }) => {
    const { t } = useTranslation();
    const [isAnimClass, setIsAnimClass] = useState(true);

    const animIntervalTime = 4;
    const iconAA = <ToolbarIcon name="iconAA" />;
    const iconFullScreen = <ToolbarIcon name="icon-fullscreen" />;
    const iconPointer = <ToolbarIcon name="pointer" />;

    useEffect(() => {
        const playAnimInterval = setInterval(() => {
            isAnimClass ? setIsAnimClass(false) : setIsAnimClass(true);
        }, animIntervalTime * 1000);

        return () => {
            playAnimInterval && clearInterval(playAnimInterval);
        };
    }, [isAnimClass]);

    useEffect(() => {
        if (isShowToolbarGuide && isMobileOnly && isSafari) {
            document.body.classList.add("no-scroll");
            document.documentElement.classList.add("no-scroll-html");
        }

        return () => {
            if (isShowToolbarGuide && isMobileOnly && isSafari) {
                document.body.classList.remove("no-scroll");
                document.documentElement.classList.remove("no-scroll-html");
            }
        };
    }, [isShowToolbarGuide]);

    const handleTurnOffGuide = () => {
        onCloseGuide();
        storeLocalStorageItem(localStorageKeys.toolbarGuide, false);
    };

    const closeGuide = () => {
        onCloseGuide();
    };

    const animClass = isAnimClass ? "has-anim" : "";

    return useMemo(() => {
        return (
            isShowToolbarGuide &&
            isMobileOnly &&
            isSafari && (
                <div className={`${Styles["toolbar-guide-container"]} ${Styles[animClass]}`}>
                    <div className={Styles["toolbar-guide-content"]}>
                        <div className={Styles["toolbar-guide-title"]}>{t("common:lobby_fullscreen")}</div>
                        <div className={Styles["anim-container"]}>
                            <div className="flex justify-center">
                                <img
                                    className={Styles["iphone-background"]}
                                    alt="iphone"
                                    src={`/static/images/hide-toolbar-guide/mockup-phone.svg?${buildVersion}`}
                                />
                            </div>
                            <div className={`flex ${Styles["iphone-step"]}`}>
                                <span className={Styles["step-number"]}>1</span>
                                <p className={Styles["step-text"]}>
                                    <span className={Styles["text-icon-aa"]}>
                                        {t("common:fullscreen_guide_1").split("{icon}")[0]}
                                        <span>{iconAA}</span>
                                        {t("common:fullscreen_guide_1").split("{icon}")[1]}
                                    </span>
                                </p>
                                <span className={Styles["step-number"]}>2</span>
                                <p className={Styles["step-text"]}>{t("common:fullscreen_guide_2")}</p>
                            </div>
                            <div className={Styles["hide-toolbar"]}>
                                <span>{t(`common:fullscreen_guide_3`)}</span>
                                <span className={Styles["icon-fullscreen"]}>{iconFullScreen}</span>
                            </div>
                            <div className={Styles["toolbar-container"]}>
                                <div className={Styles["toolbar"]}>
                                    <span className={Styles["icon-aa"]}>{iconAA}</span>
                                </div>
                                <div className={Styles["bottom-gestures"]}></div>
                            </div>
                            <span className={Styles["icon-pointer"]}>{iconPointer}</span>
                        </div>
                        <div className={Styles["button-group"]}>
                            <button className={`btn-grey ${Styles["btn"]}`} onClick={closeGuide}>
                                {t("common:close")}
                            </button>
                            <button className={`btn-red ${Styles["btn"]}`} onClick={handleTurnOffGuide}>
                                {t("common:do-not-show-again")}
                            </button>
                        </div>
                    </div>
                </div>
            )
        );
    }, [isShowToolbarGuide, isAnimClass]);
};
