import Head from "next/head";
import SieDie from "../components/games/se-die/se-die";
import styles from "../styles/Home.module.scss";
import { useRouter } from "next/router";
import * as Auth from "../common/auth/AuthManager";
import { useEffect, useState } from "react";

export default function Home() {
  const [isFirstLoad, updateState] = useState<boolean>(true);
  const [isSSO, updateSSOState] = useState<boolean>(false);
  const router = useRouter();
  let interval: NodeJS.Timeout;

  const getToken = () => {
    const tmpToken = "355ed50c-1a5b-4602-bf74-0f9f0067ec97";
    const href = `/?token=${tmpToken}`;

    router.push(href, href, { shallow: true });
    updateState(false);
  };

  const checkSSO = () => {
    const status = Auth.checkSSO(() => {
      console.log("SSO Success---------------");
      updateSSOState(true);
      Auth.authorize();
    });
    if (!status) {
      router.push("timeout", "timeout", { shallow: true });
    }
  };

  const reCheckIn = () => {
    Auth.reCheckIn((status:boolean) => {
      if (!status) {
        router.push("timeout", "timeout", { shallow: true });
      }
    });
  };

  useEffect(() => {
    isFirstLoad && getToken();
    const interval = setInterval(() => {
      reCheckIn();
    }, 60000);

    if(!isFirstLoad){
      checkSSO();
    }
    return () => clearInterval(interval);
  });

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles["game-container"]}>
          <SieDie isSSO={isSSO}></SieDie>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  );
}
