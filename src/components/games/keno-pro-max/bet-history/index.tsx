import React from "react";
import { TFunction } from "next-i18next";

import BetHistoryContainer, { ResultDetailContainer } from "../../../dashboard/history/bet-history";
import { BetLogs } from "./bet-history";
import { GetNameFromChoice } from "../keno-pro-max-helper";
import { ResultDetail } from "../../../dashboard/history/bet-history/bet-history";
import Styles from "./bet-history.module.scss";
import { GameResourceKeys } from "../../../../common/resources";

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

        return (
            <ResultDetailContainer roundId={roundId} closeModal={closeModal} gameName={t(`${gameName}:${GameResourceKeys.GAME_NAME}`)}>
                <div className={Styles["result-detail"]}>
                    <div className={Styles["card-result-container"]}></div>

                    <div className={Styles["winning-detail"]}>
                        {settlementResult?.big ? t(`${gameName}:big`) : t(`${gameName}:small`)} -{" "}
                        {settlementResult?.odd ? t(`${gameName}:odd`) : t(`${gameName}:even`)} - {t(GetNameFromChoice(settlementResult))}
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
