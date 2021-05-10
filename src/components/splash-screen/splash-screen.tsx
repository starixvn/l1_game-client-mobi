import { useRouter } from "next/router";
import Styles from "./splash-screen.module.scss";

const locales = { en: "en", vi: "vi" };
export default function SplashScreen() {
    const router = useRouter();
    const { locale } = router;
    return (
        <div className={Styles.page}>
            <div className={Styles.logo}></div>
            <div className={Styles.slogan}> {locale === locales.vi ? "Một sản phẩm của Bóng88" : ""}</div>
        </div>
    );
}
