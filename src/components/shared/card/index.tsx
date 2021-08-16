import React from "react";
import { Props } from "./type";
import Styles from "./card.module.scss";
import { ViewMode } from "../game-base/type";

const suffixNameMapping = ["heart", "diamond", "club", "spade"];
const colorNumberSuffix = ["text-red", "text-red", "text-black", "text-black"];

export const convertRank = (num: number): string => {
    num++;
    const dict = {
        11: "J",
        12: "Q",
        13: "K",
        1: "A",
    };
    return dict[num] || num.toString();
};

export const convertCardRankToIndex = (rank: string): number => {
    const dict = {
        J: 11,
        Q: 12,
        K: 13,
        A: 1,
    };

    return dict[rank] ?? parseInt(rank);
};

const Card: React.FC<Props> = (props) => {
    const { result, isSmall, viewMode } = props;
    const customClassName = props.customClassName ?? "";
    const srcPath = viewMode === ViewMode.collapse || isSmall ? "/static/images/cards/mini/" : "/static/images/cards/";
    const getCardsFull = () => {
        const nameCard = `${convertRank(result.card)}-${suffixNameMapping[result.type]}.svg`;
        return <img src={`${srcPath}${nameCard}`} className={Styles["card-suite"]} height={117} width={94} alt="suite" />;
    };

    const getCardMini = () => {
        return (
            <>
                <div className={`${Styles[colorNumberSuffix[result.type]]} ${Styles["card-number"]}`}>{convertRank(result.card)}</div>
                <img
                    src={`${srcPath}mini-${suffixNameMapping[result.type]}.svg`}
                    className={Styles["card-suite-mini"]}
                    height={48}
                    width={37}
                    alt="suite"
                />
            </>
        );
    };
    return (
        <div
            className={`${Styles[customClassName]} ${Styles["card"]} ${isSmall && Styles["small"]} ${
                viewMode === ViewMode.collapse && Styles["collapse"]
            }`}
        >
            <div className={Styles["card-shadow"]}></div>
            <div className={Styles["result"]}>{viewMode === ViewMode.collapse || isSmall ? getCardMini() : getCardsFull()}</div>
        </div>
    );
};

export default Card;
