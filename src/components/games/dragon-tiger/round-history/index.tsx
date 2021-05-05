import React from "react";
import { Round } from "../../../../types";
import { Result, SettlementResult, ObjectResult } from "../dragon-tiger";
import { convertRank } from "../../../shared/card";
import DragonTigerDot from "../dot";
import Styles from "./mini-round-history.module.scss";

const suffix = ["card-heart", "card-diamond", "card-club", "card-spade"];
export const RenderRoundDetail = (round: Round<Result, SettlementResult>, t: Function) => {
    const { roundId, settlementResult, result } = round;
    const renderValueCard = (card: ObjectResult) => {
        return (
            <>
                {convertRank(card.card)}
                <img src={`/static/images/${suffix[card.type]}.png`} className={Styles["icon"]} />
            </>
        );
    };

    return (
        <div>
            <span className={Styles["tooltip-round"]}>#{roundId}</span>
            <div>
                <span className={Styles["tooltip-title"]}>
                    <span className={Styles["result"]}>
                        {settlementResult.tie ? t("tie") : settlementResult.dragon ? t("dragon") : t("tiger")}{" "}
                    </span>
                    {renderValueCard(result["dragon"])} | {renderValueCard(result["tiger"])}
                </span>
            </div>
        </div>
    );
};

export const RenderDragonTigerDot = (
    round: Round<Result, SettlementResult>,
    isLockingBet: () => boolean,
    index: number,
    numberOfItems: number
) => {
    return <DragonTigerDot choice={round.settlementResult} highlight={!isLockingBet() && index === numberOfItems - 1} />;
};
