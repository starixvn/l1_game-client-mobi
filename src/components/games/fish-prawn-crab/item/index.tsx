import React from "react";
import Styles from "./item.module.scss";

type Props = {
    type: number;
    isSmall?: boolean;
};

const listIconName = ["icon-nai", "icon-bau", "icon-ga", "icon-ca", "icon-cua", "icon-tom"];

const ChoiceIcon: React.FunctionComponent<Props> = ({ type, isSmall }) => {
    return (
        <div
            className={`${isSmall ? Styles["icon-mini"] : Styles["score-board-item"]} ${listIconName[type]} ${
                Styles[listIconName[type].toString()]
            } `}
        ></div>
    );
};

export default ChoiceIcon;
