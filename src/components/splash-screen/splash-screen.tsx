import React, { useEffect, useRef } from "react";
import { isMobileOnly } from "react-device-detect";
import lottie from "lottie-web";
import Styles from "./splash-screen.module.scss";
import * as animationDesktop from "./anim-file/anim-desktop.json";
import * as animationMobile from "./anim-file/anim-mobile.json";

export default function SplashScreen() {
    const wrapperRefLogo = useRef<HTMLDivElement>(null);
    const animRun = isMobileOnly ? animationMobile : animationDesktop;
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
