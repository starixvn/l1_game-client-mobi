import { TFunction } from "next-i18next";
import React from "react";

import BetHistoryContainer from "../../../dashboard/history/bet-history";
import BetLogsDetails from "./bet-history-details";
import ResultDetail from "./result-detail";

export enum StateRound {
    ht,
    ft,
    live,
}

export const detectStateRound = (choice: string): number => {
    let stateRound = StateRound.ht;

    if (choice.includes("ft")) {
        stateRound = StateRound.ft;
    } else if (choice.includes("liveFT")) {
        stateRound = StateRound.live;
    }

    return stateRound;
};

const KenoMatchBetHistory: React.FunctionComponent<{ gameId: number; closeModal: () => void }> = ({ gameId, closeModal }) => {
    return (
        <BetHistoryContainer
            gameId={gameId}
            isRefund={false}
            renderResultDetail={ResultDetail}
            closeModal={closeModal}
            renderBetLogsDetails={BetLogsDetails}
            nameHeaderOnTable={["roundTime", "round", "totalStake", "win"]}
        ></BetHistoryContainer>
    );
};

export default KenoMatchBetHistory;
