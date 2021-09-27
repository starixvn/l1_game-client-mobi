import React from "react";

import BetHistoryContainer from "../../dashboard/history/bet-history";
import ResultDetailKenoMatch from "../../games/keno-match/bet-history/result-detail";
import ResultDetailKenoPower from "../../games/keno-power/bet-history/result-detail";
import { KenoMatchId } from "../keno.helper";
import BetLogsDetails from "./bet-history-details";

const KenoBetHistory: React.FunctionComponent<{ gameId: number; closeModal: () => void }> = ({ gameId, closeModal }) => {
    const resultDetail = KenoMatchId.includes(gameId) ? ResultDetailKenoMatch : ResultDetailKenoPower;
    return (
        <BetHistoryContainer
            gameId={gameId}
            isRefund={false}
            renderResultDetail={resultDetail}
            closeModal={closeModal}
            renderBetLogsDetails={BetLogsDetails}
            nameHeaderOnTable={["roundTime", "round", "totalStake", "win"]}
        ></BetHistoryContainer>
    );
};

export default KenoBetHistory;
