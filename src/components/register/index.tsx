import { useTranslation } from "next-i18next";
import React, { useState } from "react";

import { AuthContext } from "../../contexts/auth";
import NameGenerator from "../../helpers/name-generator/NameGenerator";
import { UserClientCommunication } from "../../services";
import { SSOResponse } from "sc-user-service-client/dist/auth";
import Styles from "./register.module.scss";

export default function Register(props) {
    const { t } = useTranslation("common");
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
        <div>
            <div className={Styles["login-box"]}>
                <h2>{t("registerName")}</h2>

                <form onSubmit={(event) => handleSubmit(event)}>
                    <div className={Styles["user-box"]}>
                        <input
                            type="text"
                            placeholder={t("labelUserName")}
                            value={name}
                            onChange={(e) => updateNameState(e.target.value)}
                        />
                        <label>{t("labelUserName")}</label>
                    </div>
                    <button className="btn">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        {t("btnSubmit")}
                    </button>
                </form>
            </div>
        </div>
    );
}
