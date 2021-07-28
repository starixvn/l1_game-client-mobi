import { TFunction, useTranslation } from "next-i18next";
import React from "react";

import BetHistoryContainer, { ResultDetailContainer } from "../../../dashboard/history/bet-history";
import { BetLogs } from "./bet-history";
import BaseDialog from "../../../shared/base-dialog";
import { GetNameFromChoice } from "../keno-pro-max-helper";
import { ModalType } from "../../../shared/base-dialog/type";
import { ResultDetail } from "../../../dashboard/history/bet-history/bet-history";
import Styles from "./bet-history.module.scss";

const renderResult = (bet: BetLogs, roundId: number, setIsShowResultDetail: Function, setResultDetail: Function, translate: TFunction) => {
    if (bet.result) {
        const clickHandle = () => {
            setIsShowResultDetail(true);
            setResultDetail({ bet: bet, roundId: roundId });
        };

        return (
            <div className={Styles["detail"]} onClick={() => clickHandle()}>
                {translate("details")}
            </div>
        );
    }
    return <></>;
};

const renderResultDetail = (resultDetail: ResultDetail, translate: TFunction, gameName: string, closeModal: Function) => {
    if (resultDetail) {
        const { bet, roundId } = resultDetail;
        const result: any = bet?.result;
        const settlementResult: any = bet?.settlementResult;

        return (
            <BaseDialog type={ModalType.Center} isOpen={true} onCloseModal={closeModal} enableBackdrop={true}>
                <ResultDetailContainer>
                    <div className={Styles["result-detail"]}>
                        <div className={Styles["title"]}>{translate("game_name")}</div>
                        <span className={`icon-close ${Styles["icon-close"]}`} onClick={() => closeModal()}></span>

                        <div className={Styles["roundId"]}>#{roundId}</div>
                        <div className={Styles["card-result-container"]}></div>

                        <div className={Styles["winning-detail"]}>
                            {settlementResult?.big ? translate("big") : translate("small")} -{" "}
                            {settlementResult?.odd ? translate("odd") : translate("even")} -{" "}
                            {translate(GetNameFromChoice(settlementResult))}
                        </div>
                    </div>
                </ResultDetailContainer>
            </BaseDialog>
        );
    }
    return <></>;
};

const KenoProMaxBetHistory: React.FunctionComponent<{ gameId: number; gameName: string }> = ({ gameId, gameName }) => {
    const { t } = useTranslation("kenopromax");
    return (
        <BetHistoryContainer
            gameId={gameId}
            isRefund={false}
            renderResult={(
                bet: BetLogs,
                roundId: number,
                setIsShowResultDetail: Function,
                setResultDetail: Function,
                translate: TFunction
            ) => renderResult(bet, roundId, setIsShowResultDetail, setResultDetail, translate)}
            translate={t}
            gameName={gameName.toLowerCase()}
            renderResultDetail={(resultDetail: ResultDetail, translate: TFunction, gameName: string, closeModal: Function) =>
                renderResultDetail(resultDetail, translate, gameName, closeModal)
            }
        ></BetHistoryContainer>
    );
};
export default KenoProMaxBetHistory;
