import { useTranslation } from "next-i18next";
import React, { useState } from "react";

import { useAuthContext } from "../../contexts/auth";
import NameGenerator from "./name-generator";
import { UserClientCommunication } from "../../services";
import Styles from "./register.module.scss";

export default function Register(props) {
    const { t } = useTranslation("register");
    const { handleStateLogin } = props;
    const { session } = useAuthContext();
    const nameAuto = NameGenerator.generateName;
    const [name, updateNameState] = useState<string>(nameAuto);
    const [isValidUserName, setIsValidUserName] = useState<boolean>(true);
    const [nameInValid, setNameInValid] = useState<string>("");
    const authService = UserClientCommunication.getUserClientInstance().auth;

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (validateUsername(name)) {
            setIsValidUserName(false);
            setNameInValid(t("invalidUsername"));
            return;
        }
        const re = await authService.signName(session.ss, session.username, name);
        if (re.isSuccessful) {
            handleStateLogin(re.user);
        } else {
            setNameInValid(re.message.toString());
            setIsValidUserName(false);
        }
    };
    const generateName = (event) => {
        event.preventDefault();
        updateNameState(NameGenerator.generateName);
    };

    const validateUsername = (username) => {
        const regex = new RegExp("^[a-zA-Z0-9]+$");
        return username.length > 14 || username.length < 3 || username.match(regex) === null;
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
                        <button className={`${Styles["btn-green"]} ${Styles["btn-name"]}`} onClick={(event) => generateName(event)}>
                            {t("otherName")}
                        </button>
                        {!isValidUserName && <label className={Styles["message-error"]}>{nameInValid}</label>}
                    </div>

                    <button className={`${Styles["btn-orange"]} ${Styles["btn-submit"]}`}>{t("submit")}</button>
                </form>
                <div className={Styles["note"]}>
                    <h3>{t("note")}</h3>
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
