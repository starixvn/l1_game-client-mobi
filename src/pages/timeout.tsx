import React from "react";
import Link from "next/link";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const NotFound = () => (
    <div>
        <h1>Session Timeout!</h1>
        <Link href="/">Go Home</Link>
    </div>
);

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ["common"])),
    },
});

export default NotFound;
