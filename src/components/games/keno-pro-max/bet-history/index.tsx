import React from "react";
import { TFunction } from "next-i18next";

import BetHistoryContainer from "../../../dashboard/history/bet-history";
import ResultDetailContainer from "../../../dashboard/history/bet-history/result-detail";
import { BetLogs } from "./bet-history";
import { GetChoiceTranslate, getTotalPoint } from "../keno-pro-max-helper";
import { ResultDetail } from "../../../dashboard/history/bet-history/bet-history";
import { GameResourceKeys } from "../../../../common/resources";
import { generateResult, winningInfo, renderTotalPoint } from "../round-result";
import Styles from "./bet-history.module.scss";

const renderResult = (bet: BetLogs, roundId: number, setIsShowResultDetail: Function, setBetLog: Function, t: TFunction) => {
    if (bet.result) {
        const clickHandle = () => {
            setIsShowResultDetail(true);
            setBetLog({ bet: bet, roundId: roundId, t });
        };
        const totalPoint = getTotalPoint(bet.result);

        return (
            <div className={Styles["detail"]} onClick={() => clickHandle()}>
                {totalPoint}
            </div>
        );
    }
    return <></>;
};

const renderResultDetail = (resultDetail: ResultDetail, t: TFunction, closeModal: () => void, gameName: string) => {
    if (resultDetail) {
        const { bet, roundId } = resultDetail;
        const result: any = bet?.result;
        const settlementResult: any = bet?.settlementResult;
        const textTranslate = GetChoiceTranslate(t);

        return (
            <ResultDetailContainer roundId={roundId} closeModal={closeModal} gameName={t(`${gameName}:${GameResourceKeys.GAME_NAME}`)}>
                <div className={Styles["result-detail"]}>
                    <div className={Styles["result"]}>
                        <div className={Styles["number-container"]}>{generateResult(result, false)}</div>
                        <div className={Styles["result-total-number"]}> {renderTotalPoint({ result, textTranslate })}</div>
                    </div>
                    <div className={Styles["settle-info"]}>{winningInfo({ settlementResult, textTranslate })}</div>
                </div>
            </ResultDetailContainer>
        );
    }
    return <></>;
};

const KenoProMaxBetHistory: React.FunctionComponent<{ gameId: number }> = ({ gameId }) => {
    return (
        <BetHistoryContainer
            gameId={gameId}
            isRefund={false}
            renderResult={(bet: BetLogs, roundId: number, setIsShowResultDetail: Function, setBetLog: Function, t: TFunction) =>
                renderResult(bet, roundId, setIsShowResultDetail, setBetLog, t)
            }
            renderResultDetail={(resultDetail: ResultDetail, t: TFunction, closeModal: () => void, gameName: string) =>
                renderResultDetail(resultDetail, t, closeModal, gameName)
            }
        ></BetHistoryContainer>
    );
};
export default KenoProMaxBetHistory;
