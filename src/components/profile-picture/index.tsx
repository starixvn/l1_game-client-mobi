import React from "react";

import Styles from "./profile-picture.module.scss";

const ProfilePicture: React.FC<{ avatarId: number; isEditable?: boolean; onClick?: () => void }> = ({
    avatarId,
    isEditable = false,
    onClick,
}) => {
    const handleClick = () => {
        onClick && onClick();
    };

    return (
        <div className={Styles["profile-picture"]} onClick={handleClick}>
            {avatarId > 0 && avatarId < 41 ? (
                <img src={`/static/images/avatar/${avatarId}.png`} className={Styles["avatar"]} alt="Avatar" />
            ) : (
                <span className={`icon-user ${Styles["icon-user"]}`}></span>
            )}
            {isEditable && <EditIcon />}
        </div>
    );
};

const EditIcon = () => {
    return (
        <div className={Styles["chose-avatar"]}>
            <span className={`icon-edit ${Styles["icon-edit"]}`}></span>
        </div>
    );
};

export default ProfilePicture;
