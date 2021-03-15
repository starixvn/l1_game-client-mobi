import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import * as Auth from "../common/auth/AuthManager";
import SieDie from "../components/games/se-die/se-die";
import { UserService } from "../services";
import styles from "../styles/Home.module.scss";
import * as SessionManager from "../common/auth/session-manager";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import Footer from "../components/Footer"

export default function Home() {
  const router = useRouter();
  const { t } = useTranslation("common");
  const { token } = router.query;
  const [isFirstLoad, updateState] = useState<boolean>(true);
  const [isSSO, updateSSOState] = useState<boolean>(false);

  const checkSSO = async () => {
    const signInResponse = await UserService.signIn(token);
    if (signInResponse.isAuthenticated) {
      SessionManager.storeSessionData(signInResponse);
      const session = SessionManager.getSession();
      const username = signInResponse.username;
      UserService.authorize(session.ss, username);
      updateSSOState(true);
    }

    updateState(false);
  };

  const reCheckIn = () => {
    Auth.reCheckIn((status: boolean) => {
      if (!status) {
        router.push("timeout", "timeout", { shallow: true });
      }
    });
  };

  useEffect(() => {
    if (isFirstLoad && token != undefined) {
      checkSSO();
    }
  });

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>{t("title")}</h1>
        <Link href="/" locale={router.locale === "en" ? "de" : "en"}>
          <button>{t("change-locale")}</button>
        </Link>
        <div className={styles["game-container"]}>
          <SieDie isSSO={isSSO}></SieDie>
        </div>
      </main> 
      <Footer />
    </div>
  );
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "footer"])),
  },
});
