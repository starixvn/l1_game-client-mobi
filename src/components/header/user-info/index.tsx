import React from "react";
import { User } from "sc-user-service-client/dist/auth";

import { numberWithCommas } from "../../../helpers/number-helper";
import Styles from "./user-info.module.scss";

export default function UserInfo({ user }: { user: User }) {
    return (
        <div className={Styles["user"]}>
            <div className={Styles["info"]}>
                <div className={Styles["user-name"]} data-testid="user-name">
                    {user.name}
                </div>
                <div key={user.red} className={`${Styles.balance}`} data-testid="balance">
                    {numberWithCommas(user.red ? user.red : 0)} {user.currency}
                </div>
            </div>
            <div className={Styles["avatar"]}>
                {user.avatarId > 0 && user.avatarId < 41 ? (
                    <img src={`/static/images/avatar/${user.avatarId}.png`} className="img-fluid" height="40" width="40" alt="Avatar" />
                ) : (
                    <span className={`icon-user ${Styles["icon-user"]}`} data-testid="icon-user" />
                )}
            </div>
        </div>
    );
}
