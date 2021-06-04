import React, { useEffect, useRef } from "react";
import { isMobileOnly } from "react-device-detect";
import lottie from "lottie-web";
import { useRouter } from "next/router";
import * as animationDesktopVI from "./anim-file/vi/anim-desktop.json";
import * as animationMobileVI from "./anim-file/vi/anim-mobile.json";
import * as animationDesktopEN from "./anim-file/en/anim-desktop.json";
import * as animationMobileEN from "./anim-file/en/anim-mobile.json";
import Styles from "./splash-screen.module.scss";

export default function SplashScreen() {
    const router = useRouter();
    const { locale } = router;
    const wrapperRefLogo = useRef<HTMLDivElement>(null);
    const animationDesktop = { vi: animationDesktopVI, en: animationDesktopEN };
    const animationMobile = { vi: animationMobileVI, en: animationMobileEN };
    const animRun = isMobileOnly ? animationMobile[locale] : animationDesktop[locale];
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
    }, [wrapperRefLogo]);

    return <div className={Styles.page} ref={wrapperRefLogo}></div>;
}
