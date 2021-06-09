import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

import { locales } from "../../../common/constants";

const LanguageSelection = () => {
    const { locale } = useRouter();
    const { t } = useTranslation("common");
    return (
        <>
            <Link href="/" locale="vi">
                <div className={locale === locales.vi ? "active" : ""}>{t("vietnamese")}</div>
            </Link>
            <Link href="/" locale="en">
                <div className={locale === locales.en ? "active" : ""}>{t("english")}</div>
            </Link>
        </>
    );
};

export default LanguageSelection;
