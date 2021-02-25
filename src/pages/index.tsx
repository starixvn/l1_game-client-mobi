import Head from "next/head";
import SieDie from "../components/games/se-die/se-die";
import styles from "../styles/Home.module.scss";
import { useRouter } from "next/router";
import * as Auth from "../common/auth/AuthManager";
import { useEffect, useState, useContext } from "react";
import * as SessionManager from "../common/auth/session-manager";
import * as socketIO from "socket.io-client";
import { configs } from "../../Configs";

export default function Home() {
  const [isFirstLoad, updateState] = useState<boolean>(true);
  const router = useRouter();
  let interval: NodeJS.Timeout;

  const getToken = () => {
    const tmpToken = "d0ba1619-5e11-40d1-b0bf-d6259ea48105";
    const href = `/?token=${tmpToken}`;

    router.push(href, href, { shallow: true });
    updateState(false);
  };

  const checkSSO = () => {
    const status = Auth.checkSSO(() => {
      console.log("SSO Success");
      Auth.authorize();
      connectSocket();
    });
    if (!status) {
      router.push("timeout", "timeout", { shallow: true });
    }
  };

  const connectSocket = () => {
    console.log("connect ws----------------");
    const socket = socketIO(
      configs.sedieServiceUrl + configs.serverGameEndPoints[1].path,
      {
        forceNew: true,
        transports: ["websocket"],
        upgrade: false,
        path: "",
      }
    );

    socket.on("connect", () => {
      socket.emit("signin", SessionManager.getSession());
    });
    socket.on("connect_error", (err) => console.log(err));
    socket.on("connect_failed", (err) => console.log(err));
    socket.on("disconnect", (err) => console.log(err));
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
    return () => clearInterval(interval);
  });

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <button onClick={checkSSO}>SSO</button>
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
