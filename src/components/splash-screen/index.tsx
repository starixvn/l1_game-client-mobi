import React from "react";
import { buildVersion, isL1System, locales, systemName, isSabaPlay } from "../../common/constants";
import Styles from "./splash-screen.module.scss";

export default function SplashScreen({ locale, operator = "VG" }) {
    const pageClass = isSabaPlay(operator) ? `${Styles.page} ${Styles.sabaplayOperator}` : Styles.page;
    const fileNameSuffix  = isSabaPlay(operator) ? "sabaplay" : systemName;
    const sloganSource = isSabaPlay(operator) 
        ? `/static/images/splash-screen/${locale}/slogan-${fileNameSuffix}.webp?${buildVersion}`
        : `/static/images/splash-screen/${locale}/slogan.webp?${buildVersion}`;
    
    return locale ? (
        <div className={pageClass}>
            <img
                src={`/static/images/splash-screen/logo-${fileNameSuffix}.webp?${buildVersion}`}
                className={Styles["logo"]}
                width="274"
                height="96"
                alt="Logo"
            />
            <img
                src={sloganSource}
                className={Styles["slogan"]}
                alt="Slogan"
            />
            {locale === locales.vi && isL1System() && (
                <img
                    src={`/static/images/splash-screen/${locale}/info.svg`}
                    className={Styles["info"]}
                    width="100"
                    height="26"
                    alt="Info"
                />
            )}
        </div>
    ) : (
        <></>
    );
}
