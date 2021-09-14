import React from "react";

import { isIOS, isMobileOnly } from "react-device-detect";
import { Props } from "./type";

import { ViewMode } from "../game-base/type";
import Styles from "./card.module.scss";

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

const classFollowCondition = ({ viewMode, isSmall }) => {
    if (viewMode === ViewMode.collapse) {
        return Styles["collapse"];
    }

    if (isSmall) {
        return Styles["small"];
    }

    return "";
};

const numberOnIOS = isIOS && isMobileOnly ? Styles["number-ios"] : "";

const Card: React.FC<Props> = (props) => {
    const { result, isSmall, viewMode } = props;
    const customClassName = props.customClassName ?? "";
    const isDisplayMiniCard = viewMode === ViewMode.collapse || isSmall ? true : false;
    const srcPathCard = isDisplayMiniCard ? "/static/images/cards/mini/" : "/static/images/cards/";
    const getCardsDefault = () => {
        const nameCard = `${convertRank(result.card)}-${suffixNameMapping[result.type]}.svg`;
        return <img src={`${srcPathCard}${nameCard}#v1`} className={Styles["card-suite"]} height={119} width={86} alt="suite" />;
    };
    const formatCard10 = +convertRank(result.card) === 10 ? Styles["card-number-10"] : "";

    const getCardMini = () => {
        return (
            <>
                <div className={`${Styles[colorNumberSuffix[result.type]]} ${Styles["card-number"]} ${formatCard10} ${numberOnIOS}`}>
                    {convertRank(result.card)}
                </div>
                <img
                    src={`${srcPathCard}mini-${suffixNameMapping[result.type]}.svg`}
                    className={Styles["card-suite-mini"]}
                    height={49.07}
                    width={34.5}
                    alt="suite"
                />
            </>
        );
    };

    return (
        <div className={`${Styles[customClassName]} ${Styles["card"]} ${classFollowCondition({ viewMode, isSmall })}`}>
            <div className={Styles["card-shadow"]}></div>
            <div className={Styles["result"]}>{isDisplayMiniCard ? getCardMini() : getCardsDefault()}</div>
        </div>
    );
};

export default Card;
