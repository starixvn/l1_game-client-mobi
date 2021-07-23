import React from "react";

import { Round } from "../../../../types";
import { RoundDot } from "../../../shared/round-history/dot";
import { Choices } from "../three-cards-helper";
import { Result, SettlementResult } from "../three-cards";
import Styles from "./mini-round-history.module.scss";

const suffix = ["card-heart", "card-diamond", "card-club", "card-spade"];
export const RenderRoundDetail = (round: Round<Result, SettlementResult>, t: Function) => {
    const { roundId, settlementResult, result } = round;
    return (
        <div>
            <div className="tooltip-round">#{roundId}</div>
            <div className="tooltip-title">
                <span className="tooltip-result">{settlementResult.black ? t("black") : t("red")}</span>
                {result.map((card, _) => {
                    return <img src={`/static/images/${suffix[card.suit]}.png`} className={Styles["icon"]} />;
                })}
            </div>
        </div>
    );
};

export const RenderThreeCardsDot = (round: Round<Result, SettlementResult>, isShowBlink: boolean, index: number, numberOfItems: number) => {
    const isBlack = round.settlementResult.black;

    return <RoundDot choice={isBlack ? Choices.black : Choices.red} highlight={!isShowBlink && index === numberOfItems - 1} />;
};
