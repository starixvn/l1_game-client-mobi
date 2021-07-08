import React from "react";
import Styles from "./item.module.scss";

type Props = {
    type: number;
    isSmall?: boolean;
};

const listIconName = ["fpc-nai", "fpc-bau", "fpc-ga", "fpc-ca", "fpc-cua", "fpc-tom"];
const ChoiceIcon: React.FunctionComponent<Props> = ({ type, isSmall }) => {
    return isSmall ? (
        <div className={Styles["icon-mini"]}>
            <img src={`/static/images/${listIconName[type]}.svg`} className="img-fluid" alt="symbol" />
        </div>
    ) : (
        <div className={Styles["score-board-item"]}>
            <div className={Styles["symbol-size"]}>
                <img src={`/static/images/${listIconName[type]}.svg`} className="img-fluid" alt="symbol" />
            </div>
        </div>
    );
};

export const ChoiceIconHistory: React.FunctionComponent<Props> = ({ type }) => {
    return (
        <div className={`${Styles["icon-bet-history"]}`}>
            <img src={`/static/images/${listIconName[type]}.svg`} className="img-fluid" alt="symbol" />
        </div>
    );
};

export const ChoiceIconCompactMode: React.FunctionComponent<Props> = ({ type }) => {
    return <div className={`${Styles["icon-simple-mode"]} ${listIconName[type]} ${Styles[listIconName[type].toString()]}`}></div>;
};

export default ChoiceIcon;
