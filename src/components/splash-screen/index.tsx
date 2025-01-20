import React from "react";
import { buildVersion, isL1System, locales, systemName } from "../../common/constants";
import Styles from "./splash-screen.module.scss";
import Loader from "../shared/loader";

export default function SplashScreen({ locale }) {
    return locale ? (
        <div className={`${Styles.page}`}>
            {/* <img
                src={`/static/images/splash-screen/${locale}/logo-${systemName}.svg?${buildVersion}`}
                className={Styles["logo"]}
                width="274"
                height="96"
                alt="Logo"
            />
            {locale === locales.vi && isL1System() && (
                <img
                    src={`/static/images/splash-screen/${locale}/info.svg`}
                    className={Styles["info"]}
                    width="100"
                    height="26"
                    alt="Info"
                />
            )} */}
            <Loader />
        </div>
    ) : (
        <></>
    );
}
