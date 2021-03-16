import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { AuthContextProvider } from "../components/contexts/auth";
import Footer from "../components/Footer";
import SieDie from "../components/games/se-die/se-die";
import styles from "../styles/Home.module.scss";

export default function Home() {
    const router = useRouter();
    const { t } = useTranslation("common");

    return (
        <AuthContextProvider>
            <div className={styles.container}>
                <Head>
                    <title>Create Next App</title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>

                <main className={styles.main}>
                    <h1>{t("title")}</h1>
                    <Link href="/" locale={router.locale === "en" ? "vi" : "en"}>
                        <button>{t("change-locale")}</button>
                    </Link>
                    <div className={styles["game-container"]}>
                        <SieDie isSSO={true}></SieDie>
                    </div>
                </main>
                <Footer />
            </div>
        </AuthContextProvider>
    );
}

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ["common", "footer"])),
    },
});
