import React from "react";

import { RoundDotGrid } from "../../../shared/round-history/dot";
import { checkIsDragon, checkIsTie, Choices } from "../dragon-tiger-helper";
import { useGameContext } from "../../../../contexts/game-context/game-context";
import { useTranslation } from "next-i18next";

const GetElementRound = (result: any, col: number, row: number, roundId: number) => {
    const { gameSetting } = useGameContext();
    const { id: gameId } = gameSetting;
    const { t } = useTranslation("dragontiger");
    const isDragon = checkIsDragon(result);
    const isTie = checkIsTie(result);
    return (
        <RoundDotGrid
            key={`${roundId}_${gameId}`}
            choice={isTie ? Choices.tie : isDragon ? Choices.dragon : Choices.tiger}
            col={col}
            row={row}
            value={isTie ? t("tieTextDot") : isDragon ? t("dragonTextDot") : t("tigerTextDot")}
        ></RoundDotGrid>
    );
};

export default GetElementRound;
