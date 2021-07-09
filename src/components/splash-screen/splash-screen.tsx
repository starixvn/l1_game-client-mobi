import React from "react";
import Styles from "./splash-screen.module.scss";

export default function SplashScreen({ locale }) {
    return (
        <div className={`${Styles.page}`}>
            <img
                src={`/static/images/splash-screen/${locale}/logo.svg`}
                className={`img-fluid ${Styles["logo"]}`}
                width="274"
                height="96"
                alt="Logo"
            />
            <img
                src={`/static/images/splash-screen/${locale}/info.svg`}
                className={`img-fluid ${Styles["info"]}`}
                width="100"
                height="26"
                alt="Info"
            />
        </div>
    );
}
