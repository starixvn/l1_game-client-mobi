import React, { useEffect, useRef, useState } from "react";
import { isMobileOnly } from "react-device-detect";
import lottie from "lottie-web";
import { languageMapper } from "../../common/constants";
import * as animationDesktopVI from "./anim-file/vi/anim-desktop.json";
import * as animationMobileVI from "./anim-file/vi/anim-mobile.json";
import * as animationDesktopEN from "./anim-file/en/anim-desktop.json";
import * as animationMobileEN from "./anim-file/en/anim-mobile.json";
import Styles from "./splash-screen.module.scss";

export default function SplashScreen({ locale }) {
    const [animRun, setAnimRun] = useState<any>();
    const wrapperRefLogo = useRef<HTMLDivElement>(null);
    const animationDesktop = { vi: animationDesktopVI, en: animationDesktopEN };
    const animationMobile = { vi: animationMobileVI, en: animationMobileEN };
    useEffect(() => {
        if (wrapperRefLogo.current) {
            lottie.loadAnimation({
                container: wrapperRefLogo.current,
                renderer: "svg",
                loop: true,
                autoplay: true,
                animationData: animRun,
            });
        }
    }, [wrapperRefLogo, animRun]);

    useEffect(() => {
        const langCode = languageMapper[locale];
        setAnimRun(isMobileOnly ? animationMobile[langCode] : animationDesktop[langCode]);
    }, [locale]);

    return <div className={Styles.page} ref={wrapperRefLogo}></div>;
}
