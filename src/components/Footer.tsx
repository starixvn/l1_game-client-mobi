import { version } from "next-i18next/package.json";
import { useTranslation } from "next-i18next";
import styles from "../styles/Home.module.scss";

export default  function Footer() {
  const { t } = useTranslation("footer");

  return (
    <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('title')}{" "}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
  );
};
