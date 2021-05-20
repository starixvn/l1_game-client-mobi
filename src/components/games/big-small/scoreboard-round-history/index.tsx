import React from "react";

import { checkIsSmall, countRedDot, Choices } from "../big-small-helper";
import { RoundDotGrid } from "../../../shared/round-history/dot";
import { useGameContext } from "../../../../contexts/game-context/game-context";
import { useTranslation } from "next-i18next";

const GetElementRound = (result: any, col: number, row: number, roundId: number) => {
    const { gameSetting } = useGameContext();
    const { id: gameId } = gameSetting;
    const { t } = useTranslation(gameSetting.gameName.toLowerCase());
    const isSmall = checkIsSmall(countRedDot(result));
    return (
        <RoundDotGrid
            key={`${roundId}_${gameId}`}
            choice={isSmall ? Choices.small : Choices.big}
            col={col}
            row={row}
            value={isSmall ? t("smallTextDot") : t("bigTextDot")}
        ></RoundDotGrid>
    );
};

export default GetElementRound;
