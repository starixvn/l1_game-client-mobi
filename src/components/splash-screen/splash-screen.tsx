import Styles from "./splash-screen.module.scss";

export default function SplashScreen() {
    return (
        <div className={Styles.page}>
            <div className={Styles.logo}></div>
            <div className={Styles.slogan}>Một sản phẩm của Bong88</div>
        </div>
    );
}
