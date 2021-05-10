import { useRouter } from "next/router";
import Styles from "./splash-screen.module.scss";

const locales = { en: "en", vi: "vi" };
export default function SplashScreen() {
    const router = useRouter();
    const { locale } = router;
    return (
        <div className={Styles.page}>
            <div className={Styles.logo}>
                <img src={`/static/images/logo.svg`} className="img-fluid" alt="logo" />
                <img
                    src={`/static/images/${locale === locales.vi ? "slogan-vn.svg" : "slogan-en.svg"}`}
                    className={`img-fluid ${Styles["slogan"]}`}
                    alt="slogan"
                />
            </div>

            <div className={Styles.message}> {locale === locales.vi ? "Một sản phẩm của Bóng88" : ""}</div>
        </div>
    );
}
