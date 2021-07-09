import React from "react";
import { Props } from "./type";
import Styles from "./card.module.scss";
import { ViewMode } from "../game-base/type";

const suffixClassMapping = ["card-heart", "card-diamond", "card-club", "card-spade"];
const colorNumberSuffix = ["text-red", "text-red", "text-black", "text-black"];
const pictureCard = {
    J: "card-picture-j",
    Q: "card-picture-q",
    K: "card-picture-k",
};

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

const Card: React.FC<Props> = (props) => {
    const { result, isSmall, viewMode } = props;
    const iconLarge = pictureCard[convertRank(result.card)] ? pictureCard[convertRank(result.card)] : suffixClassMapping[result.type];
    return (
        <div className={`${Styles["card"]} ${isSmall && Styles["small"]} ${viewMode === ViewMode.collapse && Styles["collapse"]}`}>
            <div className={Styles["card-shadow"]}></div>
            <div className={Styles["card-bg"]}>
                <div className={Styles["result"]}>
                    <div className={Styles["card-group-left"]}>
                        <div className={`${Styles[colorNumberSuffix[result.type]]} ${Styles["card-number"]}`}>
                            {convertRank(result.card)}
                        </div>
                        <img
                            src={`/static/images/${suffixClassMapping[result.type]}.png`}
                            className={Styles["card-suite-small"]}
                            alt="suite"
                        />
                    </div>
                    <div className={Styles["card-group-right"]}>
                        <img
                            src={`/static/images/${iconLarge}.png`}
                            className={`${pictureCard[convertRank(result.card)] ? Styles["card-picture"] : Styles["card-suite-large"]}`}
                            alt="suite"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Card;
