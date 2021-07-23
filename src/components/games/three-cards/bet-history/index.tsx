import { useTranslation } from "next-i18next";
import React from "react";
import { useGameContext } from "../../../../contexts/game-context/game-context";
import BetHistoryContainer from "../../../shared/bet-history";
import { RoundDot } from "../../../shared/round-history/dot";
import { Choices } from "../three-cards-helper";
import { BetLogs } from "./bet-history";

const renderResult = (bet: BetLogs) => {
    if (bet.result) {
        const countRed = 1;
        const isBlack = true;
        return (
            <div className="d-flex justify-content-center">
                <RoundDot choice={isBlack ? Choices.black : Choices.red} value={countRed} />
            </div>
        );
    }
    return <></>;
};

const ThreeCardsBetHistory: React.FunctionComponent<{ gameId: number }> = ({ gameId }) => {
    const { gameSetting } = useGameContext();
    const { t } = useTranslation(gameSetting.gameName.toLowerCase());
    return (
        <BetHistoryContainer
            gameId={gameId}
            isRefund={false}
            renderResult={(bet: BetLogs) => renderResult(bet)}
            translate={t}
        ></BetHistoryContainer>
    );
};
export default ThreeCardsBetHistory;
