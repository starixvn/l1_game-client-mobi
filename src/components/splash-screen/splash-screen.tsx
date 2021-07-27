import React, { useEffect, useState } from "react";
import { SSOResponse } from "sc-user-service-client/dist/auth";
import { languageMapper, locales } from "../../common/constants";
import { getLocalStorageItem, localStorageKeys } from "../../common/local-storage";
import Styles from "./splash-screen.module.scss";

const sessionKey = localStorageKeys.session;

export default function SplashScreen({ locale }) {
    const [language, setLanguage] = useState<string>(locale);

    useEffect(() => {
        if (!language) {
            const session = getLocalStorageItem<SSOResponse>(sessionKey);
            setLanguage(languageMapper[session.language]);
        }
    }, []);

    return (
        <div className={`${Styles.page}`}>
            {language && (
                <img
                    src={`/static/images/splash-screen/${language}/logo.svg`}
                    className={Styles["logo"]}
                    width="274"
                    height="96"
                    alt="Logo"
                />
            )}
            {language === locales.vi && (
                <img
                    src={`/static/images/splash-screen/${language}/info.svg`}
                    className={Styles["info"]}
                    width="100"
                    height="26"
                    alt="Info"
                />
            )}
        </div>
    );
}
