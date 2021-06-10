import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

import { locales } from "../../../common/constants";
import Styles from "./language-selection.module.scss";

const LanguageSelection = () => {
    const { locale } = useRouter();
    const { t } = useTranslation("common");
    return (
        <div className={Styles["language-selection"]}>
            <div className={Styles["header"]}>
                <span className={`icon-arrow-left ${Styles["btn-prev"]}`}></span>
                <h1 className={Styles["title"]}>Ngôn ngữ</h1>
            </div>
            <div className={Styles["lang-container"]}>
                <Link href="/" locale="vi">
                    <div className={Styles["lang-item"]}>
                        {" "}
                        <label>{t("vietnamese")}</label>
                        {locale === locales.vi && <span className={`icon-success ${Styles["icon-check"]}`}></span>}
                    </div>
                </Link>
                <Link href="/" locale="en">
                    <div className={Styles["lang-item"]}>
                        {" "}
                        <label>{t("english")}</label>
                        {locale === locales.en && <span className={`icon-success ${Styles["icon-check"]}`}></span>}
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default LanguageSelection;
