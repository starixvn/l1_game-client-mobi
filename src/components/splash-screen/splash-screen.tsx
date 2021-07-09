import React from "react";
import Styles from "./splash-screen.module.scss";

export default function SplashScreen({ locale }) {
    return (
        <div className={`${Styles.page}`}>
            <div className={Styles["logo"]}>
                <img src={`/static/images/splash-screen/${locale}/logo.svg`} className="img-fluid" width="auto" height="auto" alt="Logo" />
                <img
                    src={`/static/images/splash-screen/${locale}/slogan.svg`}
                    className={`img-fluid ${Styles["slogan"]}`}
                    width="auto"
                    height="auto"
                    alt="Logo"
                />
            </div>
            <div className={Styles["info"]}>
                <img
                    src={`/static/images/splash-screen/${locale}/info.svg`}
                    className={Styles["img-fluid"]}
                    width="auto"
                    height="auto"
                    alt="Info"
                />
            </div>
        </div>
    );
}
