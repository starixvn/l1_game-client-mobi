import React from "react";

import { Result, Cards } from "../three-cards";
import IconColumn from "../../../shared/round-history/icon-column";
import Styles from "./three-cards-scoreboard.module.scss";

const SuitIcons = ["hearts", "diamonds", "clubs", "spades"];

export const GetScoreboardDotDetailsOfSuits = (result: Result, roundId: number) => {
    return (
        <IconColumn key={roundId}>
            {result.map((value: Cards, index) => {
                return (
                    <div key={`${roundId}_${index}`} className={Styles["score-board-item"]}>
                        <div className={Styles["symbol-size"]}>
                            <img
                                srcSet={`/static/images/three-cards/${SuitIcons[value.suit]}.png 1x, /static/images/three-cards/${
                                    SuitIcons[value.suit]
                                }@2x.png 2x, /static/images/three-cards/${SuitIcons[value.suit]}@3x.png 3x`}
                                className="img-fluid"
                                width="22"
                                height="22"
                                alt="symbol"
                            />
                        </div>
                    </div>
                );
            })}
        </IconColumn>
    );
};
