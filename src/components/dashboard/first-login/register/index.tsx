import { useTranslation } from "next-i18next";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import { AuthorizeResponse, Response, User } from "sc-user-service-client/dist/auth";

import { sabaClubName, sabaMobileName, Themes } from "../../../../common/constants";
import { useAuthContext } from "../../../../contexts/auth";
import { randomInteger } from "../../../../helpers/number-helper";
import { UserClientCommunication } from "../../../../services";
import BaseDialog from "../../../shared/base-dialog";
import { ModalType } from "../../../shared/base-dialog/type";
import FirstLoginContainer from "../container";
import ThemeSelection from "../theme-selection";
import NameGenerator from "./name-generator";
import Styles from "./register.module.scss";

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
    const [selectedAvatarId, setSelectedAvatarId] = useState<number>(randomInteger(1, maxAvatarId));
    const [isValidUserName, setIsValidUserName] = useState<boolean>(true);
    const [isOpenGalleryAvatar, setIsOpenGalleryAvatar] = useState<boolean>(false);
    const [nameInValid, setNameInValid] = useState<string>("");
    const authService = UserClientCommunication.getUserClientInstance().auth;
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setTheme(Themes.light);
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (validateUsername(name)) {
            setIsValidUserName(false);
            setNameInValid(t("register:invalidUsername"));
            return;
        }
        const response = await authService.signName(session.ss, session.username, name, selectedAvatarId);
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

    const onChangeUserName = (event) => {
        event.preventDefault();
        updateNameState(event.target.value);
    };

    const clearUserName = () => {
        updateNameState("");
        setIsValidUserName(true);
    };

    const closeAvatarGallery = () => {
        setIsOpenGalleryAvatar(false);
    };

    return (
        <FirstLoginContainer>
            <div className={Styles["wrapper-welcome"]}>
                <div
                    className={Styles["welcome"]}
                    dangerouslySetInnerHTML={{ __html: t("register:registerTitle1").replace("{0}", `<b>${sabaMobileName}!</b>`) }}
                ></div>
                <div
                    className={Styles["welcome"]}
                    dangerouslySetInnerHTML={{
                        __html: t("register:registerTitle2")
                            .replace("{0}", `<b>${sabaMobileName}</b>`)
                            .replace("{1}", `<b>${sabaClubName}</b>`),
                    }}
                ></div>
                <div
                    className={Styles["welcome"]}
                    dangerouslySetInnerHTML={{ __html: t("register:registerTitle3").replace("{0}", `<b>${sabaClubName}</b>`) }}
                ></div>
            </div>

            <div className={Styles["profile-picture"]} onClick={() => setIsOpenGalleryAvatar(true)}>
                <img src={`/static/images/avatar/${selectedAvatarId}.png`} className={Styles["avartar"]} alt="Avatar" />
                <div className={Styles["chose-avatar"]}>
                    <span className={`icon-edit ${Styles["icon-edit"]}`}></span>
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
                            onChange={(event) => onChangeUserName(event)}
                        />
                        <span className={`icon-close ${Styles["icon-remove"]}`} onClick={() => clearUserName()}></span>
                    </div>

                    {!isValidUserName && (
                        <div className={Styles["hint-wrapper"]}>
                            <BaseDialog type={ModalType.Center} isOpen={isOpenGalleryAvatar}>
                                <div
                                    className={`icon-close ${Styles["icon-close-hint"]}`}
                                    onClick={() => {
                                        setIsValidUserName(true);
                                    }}
                                ></div>
                                <div className={Styles["hint-content"]}>
                                    <ul className={Styles["note"]}>
                                        <li>{t("register:rule1")}</li>
                                        <li>{t("register:rule2")}</li>
                                        <li>{t("register:rule3")}</li>
                                    </ul>
                                </div>
                            </BaseDialog>
                        </div>
                    )}

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
            <ThemeSelection />

            {isOpenGalleryAvatar && (
                <AvatarGallery selectedAvatarId={selectedAvatarId} onSelectAvatar={setSelectedAvatarId} onClose={closeAvatarGallery} />
            )}
        </FirstLoginContainer>
    );
}

const AvatarGallery: React.FC<{ selectedAvatarId: number; onSelectAvatar: (imgId: number) => void; onClose: () => void }> = ({
    selectedAvatarId,
    onSelectAvatar,
    onClose,
}) => {
    const { t } = useTranslation(["register", "common"]);
    const [selectedId, setSelectedId] = useState<number>(selectedAvatarId);

    const loadAvatars = () => {
        const _avatars = [];
        for (let index = 1; index < maxAvatarId; index++) {
            _avatars.push(<Avatar key={index} id={index} isSelected={index === selectedId} onClick={() => setSelectedId(index)} />);
        }
        return _avatars;
    };

    const submit = () => {
        onSelectAvatar(selectedId);
        onClose();
    };

    return (
        <div className={Styles["gallery-wrapper"]}>
            <BaseDialog type={ModalType.Center} isOpen={true} onCloseModal={onClose}>
                <h3 className={Styles["gallery-title"]}>{t("register:changeAvatar")}</h3>
                <div className={`icon-close ${Styles["icon-close"]}`} onClick={onClose}></div>
                <div className={Styles["container-avatars"]}>{loadAvatars()}</div>
                <div className={Styles["list-actions"]}>
                    <button className="btn-grey" onClick={onClose} type="button">
                        {t("common:cancel")}
                    </button>
                    <button className="btn-orange" onClick={submit} type="button">
                        {t("common:ok")}
                    </button>
                </div>
            </BaseDialog>
        </div>
    );
};

const Avatar: React.FC<{ id: number; isSelected: boolean; onClick: () => void }> = ({ id, isSelected, onClick }) => {
    return (
        <div className={`${Styles["img-wrapper"]} ${isSelected ? Styles["border-highlight"] : ""}`} onClick={onClick}>
            <img src={`/static/images/avatar/${id}.png`} className="img-fluid" alt="Avatar" />
            {isSelected && <div className={`icon-success ${Styles["selected-img"]}`}></div>}
        </div>
    );
};
