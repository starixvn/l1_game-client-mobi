import { useTranslation } from "next-i18next";
import React, { useState } from "react";
import { AuthorizeResponse, Response, User } from "sc-user-service-client/dist/auth";
import { useAuthContext } from "../../contexts/auth";
import { UserClientCommunication } from "../../services";
import NameGenerator from "./name-generator";
import BaseDialog from "../shared/base-dialog";
import { ModalType } from "../shared/base-dialog/type";
import { randomInteger } from "../../helpers/number-helper";
import { Spinner } from "reactstrap";
import Styles from "./register.module.scss";

type Props = {
    handleStateLogin: (user: User) => void;
};

const maxAvatarId = 40;
export default function Register(props: Props) {
    const { t } = useTranslation("register");
    const { handleStateLogin } = props;
    const { session } = useAuthContext();
    const nameAuto = NameGenerator.generateName;
    const [name, updateNameState] = useState<string>(nameAuto);
    const [avatarId, setAvatarId] = useState<number>(randomInteger(1, maxAvatarId));
    const [isValidUserName, setIsValidUserName] = useState<boolean>(true);
    const [isOpenGalleryAvatar, setIsOpenGalleryAvatar] = useState<boolean>(false);
    const [nameInValid, setNameInValid] = useState<string>("");
    const authService = UserClientCommunication.getUserClientInstance().auth;

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (validateUsername(name)) {
            setIsValidUserName(false);
            setNameInValid(t("invalidUsername"));
            return;
        }
        const response = await authService.signName(session.ss, session.username, name, avatarId);
        const authorizeResponse = response as AuthorizeResponse;
        if (authorizeResponse && authorizeResponse.authorized) {
            handleStateLogin(authorizeResponse.user);
        } else {
            setNameInValid((response as Response).message.toString());
            setIsValidUserName(false);
        }
    };
    const generateName = (event) => {
        event.preventDefault();
        setIsValidUserName(true);
        updateNameState(NameGenerator.generateName);
    };

    const validateUsername = (username: string) => {
        const regex = new RegExp("^[a-zA-Z0-9]+$");
        return username.length > 14 || username.length < 3 || username.match(regex) === null;
    };

    const clearUserName = () => {
        updateNameState("");
        setIsValidUserName(true);
    };

    const getPathAvatar = (imageId: number) => {
        return `/static/images/avatar/${imageId}.png`;
    };

    const selectedAvatar = (imgId: number) => {
        setAvatarId(imgId);
    };

    const renderGalleryAvatar = (imgId: number) => {
        return (
            <div
                key={`avatar-${imgId}`}
                onClick={() => selectedAvatar(imgId)}
                className={`${Styles["img-wrapper"]} ${avatarId === imgId ? Styles["border-highlight"] : ""}`}
            >
                <img src={getPathAvatar(imgId)} className="img-fluid" alt="Avatar" />
                {avatarId === imgId && <span className={Styles["selected-img"]}></span>}
            </div>
        );
    };

    const loadAvatars = () => {
        const _avatars = [];
        for (let index = 1; index < maxAvatarId; index++) {
            _avatars.push(renderGalleryAvatar(index));
        }
        return _avatars;
    };

    return (
        <div className={Styles["register-bg"]}>
            <div className={Styles["login-box"]}>
                <div className={Styles["register-title"]}>
                    <strong>{t("registerTitle1")}</strong>
                    <div className={Styles["register-title-mg"]}> {t("registerTitle2")}</div>
                </div>
                <div className={Styles["register-avatar-wrapper"]}>
                    <img src={getPathAvatar(avatarId)} className={`img-fluid ${Styles["img-fluid-custom"]}`} alt="Avatar" />
                    <span className={Styles["chose-avatar"]} onClick={() => setIsOpenGalleryAvatar(true)}></span>
                </div>
                <form onSubmit={(event) => handleSubmit(event)}>
                    <h5 className={Styles["input-title"]}>{t("registerName")}</h5>
                    <div className={Styles["user-box"]}>
                        <div className={Styles["register-wrapper-input"]}>
                            <input
                                type="text"
                                className={Styles["custom-form-control"]}
                                value={name}
                                onChange={(e) => updateNameState(e.target.value)}
                            />
                            <span className={`icon-close ${Styles["icon-remove"]}`} onClick={() => clearUserName()}></span>
                        </div>

                        <button
                            className={`${Styles["btn-green"]} ${Styles["btn-name"]}`}
                            onClick={(event) => generateName(event)}
                        ></button>
                    </div>
                    {!isValidUserName && <label className={Styles["message-error"]}>{nameInValid}</label>}

                    <button className={`${Styles["btn-orange"]} ${Styles["btn-submit"]}`}>{t("submit")}</button>
                </form>
                <div className={Styles["note"]}>
                    <h3>{t("note")}:</h3>
                    <ul>
                        <li>{t("rule1")}</li>
                        <li>{t("rule2")}</li>
                        <li>{t("rule3")}</li>
                    </ul>
                </div>
                {isOpenGalleryAvatar && (
                    <div className={Styles["gallery-wrapper"]}>
                        <BaseDialog type={ModalType.Center} isOpen={isOpenGalleryAvatar} onCloseModal={() => setIsOpenGalleryAvatar(false)}>
                            <h3 className={Styles["gallery-title"]}>{t("changeAvatar")}</h3>
                            <div className={`icon-close ${Styles["icon-close"]}`} onClick={() => setIsOpenGalleryAvatar(false)}></div>
                            <div className={Styles["container-avatars"]}>{loadAvatars ? loadAvatars() : <Spinner color="secondary" />}</div>
                        </BaseDialog>
                    </div>
                )}
            </div>
        </div>
    );
}
