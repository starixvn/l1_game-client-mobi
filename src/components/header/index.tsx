import React from "react";

import styles from "./header.module.scss";

type Props = {
    UID: number;
    avatarId: number;
    currency: string;
    name: string;
    balance: number;
};

const Header: React.FC<Props> = (props) => {
    return (
        <div className={styles.header}>
            <div className={styles.logo}>
                <img src="/static/images/Logo.png" alt="Logo" />
            </div>
            <div className={styles["user-info"]}>
                <div>
                    <label>Tài khoản:</label>
                    <span>{props.name}</span>
                </div>
                <div>
                    <label>Hạn mức:</label>
                    <span>{props.balance}</span>
                </div>
            </div>
        </div>
    );
};

export default Header;
