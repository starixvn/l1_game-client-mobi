import React from "react";

import { User } from "sc-user-service-client/dist/auth";
import { numberWithCommas } from "../../helpers/number-helper";
import Styles from "./user-info.module.scss";

export const UserInfo: React.FC<{ user: User; customizeClass?: string }> = ({ user, customizeClass }) => {
    return (
        <div className={`${Styles["user"]} ${customizeClass ? Styles[customizeClass] : ""}`}>
            <div className={Styles["info"]}>
                <div className={Styles["user-name"]}>{user.name}</div>
                <div key={user.red} className={`${Styles.balance}`}>
                    {numberWithCommas(user.red ? user.red : 0)} {user.currency}
                </div>
            </div>
            <div className={Styles["avatar"]}>
                {user.avatarId > 0 && user.avatarId < 41 ? (
                    <img src={`/static/images/avatar/${user.avatarId}.png`} className="img-fluid" height="40" width="40" alt="Avatar" />
                ) : (
                    <span className={`icon-user ${Styles["icon-user"]}`}></span>
                )}
            </div>
        </div>
    );
};
