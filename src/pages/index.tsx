import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import * as Auth from "../common/auth/AuthManager";
import SieDie from "../components/games/se-die/se-die";
import { UserService } from "../services";
import styles from "../styles/Home.module.scss";

export default function Home() {
    const router = useRouter();
    let interval: NodeJS.Timeout;

    const checkSSO = async () => {
        const { token } = useParams();
        const signInResponse = await UserService.signIn(token);
        if (signInResponse.isAuthenticated) {
        }
    };

    const reCheckIn = () => {
        Auth.reCheckIn((status: boolean) => {
            if (!status) {
                router.push("timeout", "timeout", { shallow: true });
            }
        });
    };

    useEffect(() => {
        checkSSO();
    });

    useEffect(() => {
        checkSSO();
    }, []);

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
                    Powered by <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
                </a>
            </footer>
        </div>
    );
}
