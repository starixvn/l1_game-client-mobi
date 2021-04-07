import React from "react";
import Styles from "./item.module.scss";

type Props = {
    type: number;
    isSmall?: boolean;
};

const listIconName = ["icon-bau", "icon-ga", "icon-ca", "icon-cua", "icon-tom", "icon-nai"];

const Item: React.FunctionComponent<Props> = ({ type, isSmall }) => {
    const iconName = listIconName.filter((name, index) => {
        return index === type;
    });

    return (
        <div className={`${isSmall ? Styles["icon-mini"] : Styles["score-board-item"]} ${iconName} ${Styles[iconName.toString()]} `}></div>
    );
};

export default Item;
