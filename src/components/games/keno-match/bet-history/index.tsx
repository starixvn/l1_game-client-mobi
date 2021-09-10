import { TFunction } from "next-i18next";
import React from "react";

import BetHistoryContainer, { FormatNumber } from "../../../dashboard/history/bet-history";
import { BetLogs } from "./bet-history";
import Styles from "./bet-history.module.scss";

const renderResult = (bet: BetLogs, roundId: number, setIsShowResultDetail: Function, setResultDetail: Function, t: TFunction) => {
    if (bet.result) {
        const clickHandle = () => {
            setIsShowResultDetail(true);
            setResultDetail({ bet: bet, roundId: roundId });
        };
        const result: any = bet?.result;

        return (
            <div className={Styles["details"]} onClick={() => clickHandle()}>
                anh
            </div>
        );
    }
};

const renderBetLogsDetails = ({ betLog, gameName, t }) => {
    const { phien, odds, betLogsDetails } = betLog;
    return (
        <>
            <h1>
                {gameName} - {t("round")}: {phien}
            </h1>
        </>
    );
};

const KenoMatchBetHistory: React.FunctionComponent<{ gameId: number; closeModal: () => void }> = ({ gameId, closeModal }) => {
    return (
        <BetHistoryContainer
            gameId={gameId}
            isRefund={false}
            renderResult={(bet: BetLogs, roundId: number, setIsShowResultDetail: Function, setResultDetail: Function, t: TFunction) =>
                renderResult(bet, roundId, setIsShowResultDetail, setResultDetail, t)
            }
            closeModal={closeModal}
            renderBetLogsDetails={renderBetLogsDetails}
            nameHeaderOnTable={["roundTime", "round", "totalStake", "win"]}
        ></BetHistoryContainer>
    );
};

export default KenoMatchBetHistory;
