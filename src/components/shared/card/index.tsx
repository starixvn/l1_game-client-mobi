import React from "react";
import { Props } from "./type";
import Styles from "./card.module.scss";

const suffixClassMapping = ["card-heart", "card-diamond", "card-club", "card-spade"];
const colorNumberSuffix = ["text-red", "text-red", "text-black", "text-black"];
const pictureCard = {
    J: "card-j-picture",
    Q: "card-q-picture",
    K: "card-k-picture",
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
    const { result } = props;
    return (
        <>
            <div className={Styles["card-shadow"]}></div>
            <div className={Styles["card-bg"]}>
                <div className={Styles["result"]}>
                    <div className={Styles["card-group-left"]}>
                        <div className={`${Styles[colorNumberSuffix[result.type]]} ${Styles["card-number"]}`}>
                            {convertRank(result.card)}
                        </div>
                        <div className={`${Styles[suffixClassMapping[result.type] + "-small"]} ${Styles["card-suite-small"]}`}></div>
                    </div>
                    <div className={Styles["card-group-right"]}>
                        <div
                            className={`${
                                pictureCard[convertRank(result.card)]
                                    ? Styles[pictureCard[convertRank(result.card)]]
                                    : Styles[suffixClassMapping[result.type]]
                            }`}
                        ></div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Card;
