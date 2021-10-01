import React from "react";

import BetHistoryContainer from "../../dashboard/history/bet-history";
import BetLogsDetails from "./bet-history-details";
import ResultDetail from "./result-detail";

const KenoBetHistory: React.FunctionComponent<{ gameId: number; closeModal: () => void }> = ({ gameId, closeModal }) => {
    return (
        <BetHistoryContainer
            gameId={gameId}
            isRefund={false}
            renderResultDetail={ResultDetail}
            closeModal={closeModal}
            renderBetLogsDetails={BetLogsDetails}
            nameHeaderOnTable={["roundTime", "round", "totalStake", "onlyRefund", "win"]}
        ></BetHistoryContainer>
    );
};

export default KenoBetHistory;
