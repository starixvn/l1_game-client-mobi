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
import HeaderStyles from "../header/header.module.scss";
import { useTheme } from "next-themes";
import { Themes } from "../../common/constants";

type Props = {
    handleStateLogin: (user: User, theme: string) => void;
};

const maxAvatarId = 40;
export default function Register(props: Props) {
    const { t } = useTranslation(["register", "common"]);
    const { handleStateLogin } = props;
    const { session } = useAuthContext();
    const nameAuto = NameGenerator.generateName;
    const [name, updateNameState] = useState<string>(nameAuto);
    const [avatarId, setAvatarId] = useState<number>(randomInteger(1, maxAvatarId));
    const [selectedAvatarId, setSelectedAvatarId] = useState<number>(avatarId);
    const [isValidUserName, setIsValidUserName] = useState<boolean>(true);
    const [isOpenGalleryAvatar, setIsOpenGalleryAvatar] = useState<boolean>(false);
    const [nameInValid, setNameInValid] = useState<string>("");
    const authService = UserClientCommunication.getUserClientInstance().auth;
    const { theme, setTheme } = useTheme();

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (validateUsername(name)) {
            setIsValidUserName(false);
            setNameInValid(t("register:invalidUsername"));
            return;
        }
        const response = await authService.signName(session.ss, session.username, name, avatarId);
        const authorizeResponse = response as AuthorizeResponse;
        if (authorizeResponse && authorizeResponse.authorized) {
            handleStateLogin(authorizeResponse.user, theme);
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
        setSelectedAvatarId(imgId);
    };

    const renderGalleryAvatar = (imgId: number) => {
        return (
            <div
                key={`avatar-${imgId}`}
                onClick={() => selectedAvatar(imgId)}
                className={`${Styles["img-wrapper"]} ${selectedAvatarId === imgId ? Styles["border-highlight"] : ""}`}
            >
                <img src={getPathAvatar(imgId)} className="img-fluid" alt="Avatar" />
                {selectedAvatarId === imgId && <div className={`icon-success ${Styles["selected-img"]}`}></div>}
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

    const onChangeImgId = () => {
        setAvatarId(selectedAvatarId);
        setIsOpenGalleryAvatar(false);
    };

    const handleCloseGallery = () => {
        setIsOpenGalleryAvatar(false);
        setSelectedAvatarId(avatarId);
    };

    return (
        <div className={Styles["page-bg"]}>
            <div className={HeaderStyles["header"]}>
                <div className="game-container">
                    <div className={Styles["logo"]}>
                        <img src={`/static/images/logo-custom-saba.svg`} className="img-fluid" alt="logo" />
                    </div>
                </div>
            </div>
            <div className={`game-container ${Styles["bg"]}`}>
                <div className={Styles["curve"]}>
                    <div className={Styles["page-container"]}>
                        <h1 className={Styles["wellcome"]}>{t("register:registerTitle1")}</h1>
                        <div> {t("register:registerTitle2")}</div>
                    </div>
                </div>
                <div className={Styles["page-container"]}>
                    <div className={Styles["profile-picture"]} onClick={() => setIsOpenGalleryAvatar(true)}>
                        <img src={getPathAvatar(avatarId)} className={Styles["avartar"]} alt="Avatar" />
                        <div className={Styles["chose-avatar"]}>
                            <span className="icon-edit"></span>
                        </div>
                    </div>
                    <form className={Styles["login-form"]} onSubmit={(event) => handleSubmit(event)}>
                        <label className={Styles["input-title"]}>{t("register:registerName")}</label>
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
                                className={`${Styles["btn-green"]} ${Styles["btn-refresh"]}`}
                                onClick={(event) => generateName(event)}
                                type="button"
                            >
                                <span className="icon-refresh"></span>
                            </button>
                        </div>
                        {!isValidUserName && <label className={Styles["message-error"]}>{nameInValid}</label>}

                        <button className={`${Styles["btn-orange"]} ${Styles["btn-submit"]}`} type="submit">
                            {t("submit")}
                        </button>
                    </form>
                    {/* <ul className={Styles["note"]}>
                        <li>{t("register:rule1")}</li>
                        <li>{t("register:rule2")}</li>
                        <li>{t("register:rule3")}</li>
                    </ul> */}
                    <div className={Styles["theme-container"]}>
                        <div className={Styles["theme-select-title"]}>{t("common:selectTheme")}</div>
                        <div className={Styles["theme-list"]}>
                            <div className={Styles["theme"]}>
                                <div className={`${Styles["theme-light-icon"]}`}>
                                    <span className={Styles["line1"]}></span>
                                    <span className={Styles["line2"]}></span>
                                </div>
                                <div>
                                    <input
                                        id="theme-light"
                                        type="radio"
                                        name="theme"
                                        checked={theme === Themes.light}
                                        onClick={() => setTheme(Themes.light)}
                                        className={Styles["radio-button"]}
                                    />
                                    <label className={Styles["radio-label"]} htmlFor="theme-light">
                                        {t("common:light")}
                                    </label>
                                </div>
                            </div>
                            <div className={Styles["theme"]}>
                                <div className={Styles["theme-dark-icon"]}>
                                    <span className={Styles["line1"]}></span>
                                    <span className={Styles["line2"]}></span>
                                </div>
                                <div>
                                    <input
                                        id="theme-dark"
                                        type="radio"
                                        name="theme"
                                        checked={theme === Themes.dark}
                                        onClick={() => setTheme(Themes.dark)}
                                        className={Styles["radio-button"]}
                                    />
                                    <label className={Styles["radio-label"]} htmlFor="theme-dark">
                                        {t("common:dark")}
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {isOpenGalleryAvatar && (
                        <div className={Styles["gallery-wrapper"]}>
                            <BaseDialog
                                type={ModalType.Center}
                                isOpen={isOpenGalleryAvatar}
                                onCloseModal={() => setIsOpenGalleryAvatar(false)}
                            >
                                <h3 className={Styles["gallery-title"]}>{t("register:changeAvatar")}</h3>
                                <div className={`icon-close ${Styles["icon-close"]}`} onClick={() => handleCloseGallery()}></div>
                                <div className={Styles["container-avatars"]}>
                                    {loadAvatars ? loadAvatars() : <Spinner color="secondary" />}
                                </div>
                                <div className={Styles["list-actions"]}>
                                    <button className="btn-grey" onClick={() => handleCloseGallery()} type="button">
                                        {t("common:cancel")}
                                    </button>
                                    <button className="btn-orange" onClick={() => onChangeImgId()} type="button">
                                        {t("common:ok")}
                                    </button>
                                </div>
                            </BaseDialog>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
