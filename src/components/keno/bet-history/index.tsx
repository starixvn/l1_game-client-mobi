import React from "react";

import BetHistoryContainer from "../../dashboard/history/bet-history";
import BetLogsDetails from "./bet-history-details";
import ResultDetail from "./result-detail";

const KenoBetHistory: React.FunctionComponent<{ gameId: number; fractionalOddsFormat: boolean | undefined; closeModal: () => void }> = ({
    gameId,
    fractionalOddsFormat,
    closeModal,
}) => {
    return (
        <BetHistoryContainer
            gameId={gameId}
            isRefund={false}
            renderResultDetail={ResultDetail}
            closeModal={closeModal}
            renderBetLogsDetails={BetLogsDetails}
            fractionalOddsFormat={fractionalOddsFormat}
            nameHeaderOnTable={["roundTime", "round", "totalStake", "onlyRefund", "win"]}
        ></BetHistoryContainer>
    );
};

export default KenoBetHistory;
