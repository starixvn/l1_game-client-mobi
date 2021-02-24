import Head from "next/head";
import SieDie from "../components/games/se-die/se-die";
import styles from "../styles/Home.module.scss";
import { useRouter } from "next/router";
import * as Auth from "../common/auth/AuthManager";
import { useEffect, useState, useContext } from "react";
import { SocketContext } from '../components/contexts/socket/socket-context';
import * as SessionManager from "../common/auth/session-manager"

export default function Home() {
  const [isFirstLoad, updateState] = useState<boolean>(true);
  const socket = useContext(SocketContext);
  const router = useRouter();
  const getToken = () => {
    const tmpToken = "4723ddc7-78f1-4a39-a570-a0977dc60d6c";
    const href = `/?token=${tmpToken}`;

    router.push(href, href, { shallow: true });
    updateState(false);
  };

  const checkSSO = () => {
    const status = Auth.checkSSO(() => {
      console.log("SSO Success");
      connectSocket();
    });
    if (!status) {
      router.push("timeout", "timeout", { shallow: true });
    }
  };

  const connectSocket = () => {
    socket.on("connect", () => {
      socket.emit("signin", SessionManager.getSession());
  });

  }

  useEffect(() => {
    isFirstLoad && getToken();
  });
  const reCheckIn = () => {
    const  status = Auth.reCheckIn();
    if (!status) {
      router.push("timeout", "timeout", { shallow: true });
    }
  };


  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
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
