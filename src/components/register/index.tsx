import { useTranslation } from "next-i18next";
import React, { useState } from "react";
import { SSOResponse } from "sc-user-service-client/dist/auth";

import { AuthContext } from "../../contexts/auth";
import NameGenerator from "../../helpers/name-generator/NameGenerator";
import { UserClientCommunication } from "../../services";
import Styles from "./register.module.scss";

export default function Register(props) {
    const { t } = useTranslation("register");
    const { handleStateLogin } = props;
    const session = React.useContext<SSOResponse>(AuthContext);
    const nameAuto = NameGenerator.generateName;
    const [name, updateNameState] = useState<string>(nameAuto);
    const authService = UserClientCommunication.getUserClientInstance().auth;

    const handleSubmit = async (event) => {
        event.preventDefault();
        const re = await authService.signName(session.ss, session.username, name);
        if (re.isSuccessful) {
            handleStateLogin();
        }
    };
    return (
        <div className={Styles["register-bg"]}>
            <div className={Styles["login-box"]}>
                <h2>{t("registerName")}</h2>

                <form onSubmit={(event) => handleSubmit(event)}>
                    <div className={Styles["user-box"]}>
                        <input
                            type="text"
                            className={Styles["custom-form-control"]}
                            value={name}
                            onChange={(e) => updateNameState(e.target.value)}
                        />
                        <button className={`${Styles["btn-green"]} ${Styles["btn-name"]}`}>{t("otherName")}</button>
                        <label className={Styles["message-error"]}></label>
                    </div>

                    <button className={`${Styles["btn-orange"]} ${Styles["btn-submit"]}`}>{t("submit")}</button>
                </form>
                <div className={Styles["note"]}>
                    <h3>{t("yourNickName")}</h3>
                    <ul>
                        <li>{t("rule1")}</li>
                        <li>{t("rule2")}</li>
                        <li>{t("rule3")}</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
