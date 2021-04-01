import React from "react";
import Link from "next/link";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const GameGuide = () => (
    <div>
        <h1>Game Guide</h1>
        <Link href="/">Go Home</Link>
    </div>
);

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ["common"])),
    },
});

export default GameGuide;
