import React, { useEffect, useState, useMemo } from "react";
import { useTranslation, TFunction } from "next-i18next";
import { useRouter } from "next/router";

import axios from "axios";
import appSettings from "../../../../common/app-settings";
import { useAuthContext } from "../../../../contexts/auth";
import { numberWithCommas } from "../../../../helpers/number-helper";
import { formatDate } from "../../../../helpers/time-helper";
import { clearSession } from "../../../../services/auth-service";
import { BetLogs, PropsBetContainer, PropsResultDetail, ResultDetail } from "./bet-history";
import BaseDialog from "../../../shared/base-dialog";
import { ModalType } from "../../../shared/base-dialog/type";
import Loader from "../../../shared/loader";
import { v4 as uuidv4 } from "uuid";
import Styles from "./bet-history.module.scss";

const fontWeightClass = "font-weight-medium";
const NUMBER_ROWS_DISPLAY = 16;
const infiniteLoadBeginEdgeOffset = 100;

export const ResultDetailContainer: React.FC<PropsResultDetail> = (props) => {
    const { children, roundId, closeModal, gameName } = props;
    return (
        <BaseDialog type={ModalType.Center} isOpen={true} onCloseModal={closeModal}>
            <div key={roundId} className={Styles["popup-result-detail"]}>
                <div className={Styles["game-name"]}>{gameName}</div>
                <span className={`icon-close ${Styles["icon-close"]}`} onClick={() => closeModal()}></span>
                <div className={Styles["roundId"]}>#{roundId}</div>
                {children}
            </div>
        </BaseDialog>
    );
};

export const FormatNumber: React.FC = ({ children }) => {
    return <span className={`font-number nowrap ${Styles["number-text"]}`}>{children}</span>;
};

const renderStake = (bet: BetLogs) => {
    if (bet.settlementResult) {
        const keysChoices = Object.keys(bet.settlementResult);
        return (
            <>
                {keysChoices.map((name, index) => {
                    if (bet[name] > 0) {
                        return (
                            <div key={index} className={bet.settlementResult[name] ? fontWeightClass : ""}>
                                {numberWithCommas(bet[name])}
                            </div>
                        );
                    }
                    return null;
                })}
            </>
        );
    }

    return <></>;
};

const renderStakeRefund = (bet: BetLogs) => {
    if (bet.settlementResult) {
        return (
            <>
                <div className={bet.betwin > 0 ? fontWeightClass : ""}>{numberWithCommas(bet.amount)}</div>
                <div className={bet.refund > 0 ? Styles["refund"] : ""}>{numberWithCommas(bet.refund)}</div>
            </>
        );
    }

    return <></>;
};

const renderBetBase = (bet: BetLogs, t: TFunction, mainOdds: object, gameName: string) => {
    if (bet.settlementResult) {
        const keysChoices = Object.keys(bet.settlementResult);
        const odds = bet.odds ? bet.odds : mainOdds;
        return (
            <div className={Styles["list-choices"]}>
                {keysChoices &&
                    keysChoices.map((name, index) => {
                        const classHighLight = bet.settlementResult[name] ? fontWeightClass : "";
                        if (bet[name] > 0) {
                            return (
                                <div key={index} className={classHighLight}>
                                    {t(`${gameName}:${name}`)}@<FormatNumber>{odds[name] ? `${odds[name]}` : ""}</FormatNumber>
                                </div>
                            );
                        }
                        return "";
                    })}
            </div>
        );
    }

    return <></>;
};

const renderDataOnCell = (data: any, isHighligh: boolean) => {
    return <td className={`${isHighligh ? "highlight" : ""}`}>{data}</td>;
};

const RenderCell: React.FC<{
    betHistoryItem: BetLogs;
    isRefund: boolean;
    renderResult: (
        rowData: BetLogs,
        roundId?: number,
        setIsShowResultDetail?: Function,
        setResultDetail?: Function,
        t?: TFunction
    ) => JSX.Element;
    renderBet: (rowData: BetLogs, t: TFunction, odds: object, gameName: string) => {};
    t: TFunction;
    setIsShowResultDetail: Function;
    setResultDetail: Function;
    gameName: string;
}> = ({ betHistoryItem, renderResult, renderBet, isRefund, setIsShowResultDetail, setResultDetail, t, gameName }) => {
    const { time, phien, betwin } = betHistoryItem;
    const odds = betHistoryItem.odds;
    const isHighligh = betwin > 0 ? true : false;
    const fontNumber = "font-number";
    const classBetWin = `font-weight-medium ${Styles["bet-win"]} ${fontNumber}`;
    return (
        <>
            {renderDataOnCell(
                <FormatNumber>
                    <div className="time">{time && formatDate(new Date(time), "hh:mm:ss")}</div>
                    <div className="date">{time && formatDate(new Date(time), "dd/MM/yy")}</div>
                </FormatNumber>,

                isHighligh
            )}
            {renderDataOnCell(<FormatNumber>{phien}</FormatNumber>, isHighligh)}
            {renderDataOnCell(renderResult(betHistoryItem, phien, setIsShowResultDetail, setResultDetail, t), isHighligh)}
            {renderDataOnCell(renderBet(betHistoryItem, t, odds, gameName), isHighligh)}
            {renderDataOnCell(
                <div className={`${Styles["stake"]} ${fontNumber}`}>
                    {isRefund ? renderStakeRefund(betHistoryItem) : renderStake(betHistoryItem)}
                </div>,
                isHighligh
            )}
            {renderDataOnCell(<div className={classBetWin}> {betwin && numberWithCommas(betwin)}</div>, isHighligh)}
        </>
    );
};

let totalPage = 0;
let isFetchingData = false;
const BetHistoryContainer = (props: PropsBetContainer) => {
    const { renderResult, isRefund, gameId, renderResultDetail } = props;
    let { renderBet } = props;
    if (!props.renderBet) {
        renderBet = renderBetBase;
    }
    const router = useRouter();
    const { session } = useAuthContext();
    const gameSetting = appSettings.gameSettings[gameId];
    const gameName = gameSetting.gameName.toLowerCase();
    const { t } = useTranslation(["bethistory", gameName]);

    const [listBetHistory, setListBetHistory] = useState<object[]>([]);
    const [page, setPage] = useState<number>(1);
    const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);
    const [isShowResultDetail, setIsShowResultDetail] = useState<boolean>(false);
    const [resultDetail, setResultDetail] = useState<ResultDetail>();

    useEffect(() => {
        const { proxy } = appSettings;
        const historyAPI = `${proxy.ssl ? "https" : "http"}://${proxy.uri + proxy.path}/${gameSetting.socketInfo.path}/api/history`;

        const sendPostBetHistory = async () => {
            isFetchingData = true;
            try {
                const resp = await axios.post(historyAPI, {
                    session: session.ss,
                    page: page,
                    pageSize: NUMBER_ROWS_DISPLAY,
                    username: session.username,
                });
                const bets = resp.data.history;
                fetchBetHistory(bets);
                setIsFirstLoad(false);
                if (page === 1) {
                    totalPage = Math.ceil(bets.total / NUMBER_ROWS_DISPLAY);
                }
            } catch (err) {
                if (err.response.status === 401) {
                    clearSession();
                    router.push("/timeout");
                }
            }
        };

        const fetchBetHistory = (betHistory) => {
            if (betHistory && betHistory.betLogs.length > 0) {
                const data = betHistory.betLogs;
                setListBetHistory([...listBetHistory, ...data]);

                isFetchingData = false;
            }
        };

        sendPostBetHistory();
    }, [page]);

    return useMemo(() => {
        const closeModalResultDetail = () => {
            setIsShowResultDetail(false);
        };

        const renderHeaderRows = () => {
            return (
                <tr>
                    <th>{t("roundTime")}</th>
                    <th>{t("round")}</th>
                    <th>{t("result")}</th>
                    <th>{t("choice")}</th>
                    {isRefund ? <th>{t("refund")}</th> : <th>{t("stake")}</th>}
                    <th>{t("win")}</th>
                </tr>
            );
        };

        const handleScroll = (e) => {
            if (Math.ceil(e.target.offsetHeight + e.target.scrollTop) > e.target.scrollHeight - infiniteLoadBeginEdgeOffset) {
                return;
            }

            if (page + 1 <= totalPage && !isFetchingData) {
                setPage(page + 1);
            }
        };

        return (
            <>
                {isFirstLoad ? (
                    <div className={Styles["history-loading"]}>
                        <Loader></Loader>
                    </div>
                ) : listBetHistory.length > 0 ? (
                    <div className="table-container react-infinite-table" onScroll={(e) => handleScroll(e)}>
                        <table key={uuidv4()} className="table text-center">
                            <thead>{renderHeaderRows()}</thead>
                            <tbody>
                                {listBetHistory.length > 0 &&
                                    listBetHistory.map((bet: BetLogs) => {
                                        return (
                                            <tr key={bet.phien} className={bet.betwin > 0 ? "highlight" : ""}>
                                                {RenderCell({
                                                    betHistoryItem: bet,
                                                    isRefund: isRefund,
                                                    renderResult: renderResult,
                                                    renderBet: renderBet,
                                                    t: t,
                                                    setIsShowResultDetail: setIsShowResultDetail,
                                                    setResultDetail: setResultDetail,
                                                    gameName: gameName,
                                                })}
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    t("noBetHistory")
                )}
                {isShowResultDetail && renderResultDetail(resultDetail, t, closeModalResultDetail, gameName)}
            </>
        );
    }, [isFirstLoad, listBetHistory, isShowResultDetail]);
};

export default BetHistoryContainer;
