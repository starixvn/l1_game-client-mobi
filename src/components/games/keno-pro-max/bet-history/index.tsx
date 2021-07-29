import React from "react";
import { TFunction } from "next-i18next";

import BetHistoryContainer, { ResultDetailContainer } from "../../../dashboard/history/bet-history";
import { BetLogs } from "./bet-history";
import { GetChoiceTranslate } from "../keno-pro-max-helper";
import { ResultDetail } from "../../../dashboard/history/bet-history/bet-history";
import { GameResourceKeys } from "../../../../common/resources";
import { getSettleResult, generateResult } from "../animations";
import Styles from "./bet-history.module.scss";

const renderResult = (bet: BetLogs, roundId: number, setIsShowResultDetail: Function, setResultDetail: Function, t: TFunction) => {
    if (bet.result) {
        const clickHandle = () => {
            setIsShowResultDetail(true);
            setResultDetail({ bet: bet, roundId: roundId });
        };

        return (
            <div className={Styles["detail"]} onClick={() => clickHandle()}>
                {t("details")}
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
        const settleResult = getSettleResult(result, settlementResult);
        const texts = GetChoiceTranslate(t, settleResult);
        return (
            <ResultDetailContainer roundId={roundId} closeModal={closeModal} gameName={t(`${gameName}:${GameResourceKeys.GAME_NAME}`)}>
                <div className={Styles["result-detail"]}>
                    <div className={Styles["result"]}>
                        <div className={Styles["number-container"]}>{generateResult(result, settleResult.shuffle, false)}</div>

                        <div className={Styles["result-total"]}>
                            <div className={Styles["result-total-number"]}>{settleResult.settleTotal}</div>
                        </div>
                    </div>

                    <div className={Styles["winning-detail"]}>
                        <div className={Styles["settle-info"]}>
                            <div className={Styles[`result-info-${settleResult.even ? "blue" : "red"}`]}>{texts.even}</div>
                            <div className={Styles[`result-info-${settleResult.big ? "blue" : "red"}`]}>{texts.big}</div>
                            <div className={Styles["result-info-grey"]}>{texts.element}</div>
                        </div>
                    </div>
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
            renderResult={(bet: BetLogs, roundId: number, setIsShowResultDetail: Function, setResultDetail: Function, t: TFunction) =>
                renderResult(bet, roundId, setIsShowResultDetail, setResultDetail, t)
            }
            renderResultDetail={(resultDetail: ResultDetail, t: TFunction, closeModal: () => void, gameName: string) =>
                renderResultDetail(resultDetail, t, closeModal, gameName)
            }
        ></BetHistoryContainer>
    );
};
export default KenoProMaxBetHistory;
