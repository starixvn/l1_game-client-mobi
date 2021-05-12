import { useRouter } from "next/router";
import { locales } from "../../common/constants";
import Styles from "./splash-screen.module.scss";

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

            {locale === locales.vi ? (
                <div className={Styles.message}>
                    <span>Một sản phẩm của</span>
                    <img className={Styles["logo-bong88"]} src={`/static/images/logo-bong88.svg`} alt="Bong88" />
                </div>
            ) : (
                ""
            )}
        </div>
    );
}
