import React, { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { locales } from "../../common/constants";
import lottie from "lottie-web";
import Styles from "./splash-screen.module.scss";
import * as animationData from "./logo-animation.json";

export default function SplashScreen() {
    const wrapperRefLogo = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const { locale } = router;

    useEffect(() => {
        if (wrapperRefLogo.current) {
            lottie.loadAnimation({
                container: wrapperRefLogo.current,
                renderer: "svg",
                loop: true,
                autoplay: true,
                animationData: animationData,
            });
        }
    }, [wrapperRefLogo]);

    return <div className={Styles.page} ref={wrapperRefLogo}></div>;
}
