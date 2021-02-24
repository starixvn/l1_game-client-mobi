import Head from "next/head";
import SieDie from "../components/games/se-die/se-die";
import styles from "../styles/Home.module.scss";
import { useRouter } from "next/router";
import * as Auth from "../common/auth/AuthManager";

export default function Home() {
  const router = useRouter();
  const getToken = () => {
    const tmpToken = "daed176d-7b93-484e-8bcc-48ec6566379c";
    const href = `/?token=${tmpToken}`;

    router.push(href, href, { shallow: true });
  };

  const checkSSO = () => {
    const status = Auth.checkSSO(() => {
      console.log("SSO Success");
    });
    if (!status) {
      router.push("timeout", "timeout", { shallow: true });
    }
  };

  const reCheckIn = () => {
    const  status = Auth.reCheckIn();
    // if (!status) {
    //   router.push("timeout", "timeout", { shallow: true });
    // }
  };

  return (
    
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <button onClick={getToken}>Get token</button>
        <button onClick={checkSSO}>SSO</button>
        <button onClick={reCheckIn}>reCheckIn</button>
        <div className={styles["game-container"]}>
          <SieDie></SieDie>
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

