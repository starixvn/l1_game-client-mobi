import React, { useEffect, useState, useMemo } from "react";
import { useTranslation, TFunction } from "next-i18next";
import { useRouter } from "next/router";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

import appSettings from "../../../../common/app-settings";
import { useAuthContext } from "../../../../contexts/auth";
import { numberWithCommas } from "../../../../helpers/number-helper";
import { formatDate } from "../../../../helpers/time-helper";
import { clearSession } from "../../../../services/auth-service";
import { BetLogs, PropsBetContainer, ResultDetail } from "./bet-history";
import Loader from "../../../shared/loader";
import { GamesIdKenoMatch, NUMBER_ROWS_DISPLAY, InfiniteLoadBeginEdgeOffset } from "./constants";
import BetHistoryDetailsContainer from "./bet-history-details";
import Styles from "./bet-history.module.scss";

const fontWeightClass = "font-weight-medium";
let totalPage = 0;
let isFetchingHistory = false;

export const FormatNumber: React.FC = ({ children }) => {
    return <span className={`font-number nowrap ${Styles["number-text"]}`}>{children}</span>;
};

const renderStake = (bet: BetLogs, freeBet: boolean) => {
    if (bet.settlementResult) {
        const keysChoices = Object.keys(bet.settlementResult);
        return (
            <>
                {keysChoices.map((name, index) => {
                    if (bet[name] > 0) {
                        return (
                            <div key={index} className={bet.settlementResult[name] ? fontWeightClass : ""}>
                                {freeBet ? 0 : numberWithCommas(bet[name])}
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

const renderRound = ({ phien, freeBet }) => {
    return (
        <>
            <FormatNumber>{phien}</FormatNumber>
            {freeBet && (
                <div>
                    <img src={`/static/images/L2-cash/scoin.png`} className={Styles["scoin"]} alt="scoin" />
                </div>
            )}
        </>
    );
};

export const renderDataOnCell = (data: any, isHighligh: boolean, index: number) => {
    return (
        <td key={index} className={`${isHighligh ? "highlight" : ""}`}>
            {data}
        </td>
    );
};

export const renderTimes = ({ time }) => {
    return (
        <FormatNumber>
            <div className="time">{time && formatDate(new Date(time), "hh:mm:ss")}</div>
            <div className="date">{time && formatDate(new Date(time), "dd/MM/yy")}</div>
        </FormatNumber>
    );
};

const renderCellOnTable: React.FC<{
    betHistoryItem: BetLogs;
    renderResult: (
        rowData: BetLogs,
        roundId?: number,
        setIsShowResultDetail?: Function,
        setBetLog?: Function,
        t?: TFunction
    ) => JSX.Element;
    renderBet: (rowData: BetLogs, t: TFunction, odds: object, gameName: string) => {};
    t: TFunction;
    setIsShowResultDetail: Function;
    gameName: string;
    setIsShowBetLogDetails: Function;
    setBetLog: Function;
    headerName: string[];
}> = ({ betHistoryItem, renderResult, renderBet, setIsShowResultDetail, t, gameName, setIsShowBetLogDetails, setBetLog, headerName }) => {
    const { time, phien, betwin, freeBet, totalAmount } = betHistoryItem;
    const odds = betHistoryItem.odds;
    const isHighligh = betwin > 0 ? true : false;
    const fontNumber = "font-number";
    const classBetWin = `font-weight-medium ${Styles["bet-win"]} ${fontNumber}`;

    const onClickTotalAmount = () => {
        setIsShowBetLogDetails(true);
        setBetLog({ bet: betHistoryItem, roundId: phien, t });
    };

    return (
        <>
            {headerName.map((name, index) => {
                switch (name) {
                    case "roundTime":
                        return renderDataOnCell(renderTimes({ time }), isHighligh, index);
                    case "round":
                        return renderDataOnCell(renderRound({ phien, freeBet }), isHighligh, index);
                    case "result":
                        return renderDataOnCell(
                            renderResult(betHistoryItem, phien, setIsShowResultDetail, setBetLog, t),
                            isHighligh,
                            index
                        );
                    case "choice":
                        return renderDataOnCell(renderBet(betHistoryItem, t, odds, gameName), isHighligh, index);
                    case "stake":
                        return renderDataOnCell(
                            <div className={`${Styles["stake"]} ${fontNumber}`}>{renderStake(betHistoryItem, freeBet)}</div>,
                            isHighligh,
                            index
                        );
                    case "refund":
                        return renderDataOnCell(
                            <div className={`${Styles["stake"]} ${fontNumber}`}>{renderStakeRefund(betHistoryItem)}</div>,
                            isHighligh,
                            index
                        );
                    case "totalStake":
                        return renderDataOnCell(
                            <div className={`${Styles["total-stake"]} ${fontNumber}`} onClick={() => onClickTotalAmount()}>
                                <FormatNumber>{totalAmount}</FormatNumber>
                            </div>,
                            isHighligh,
                            index
                        );
                    case "win":
                        return renderDataOnCell(
                            <div className={classBetWin}> {betwin && numberWithCommas(betwin)}</div>,
                            isHighligh,
                            index
                        );
                    default:
                        return <></>;
                }
            })}
        </>
    );
};

export const renderHeaderRows = ({ headerName, t }) => {
    return (
        <tr>
            {headerName.map((name: string, index: number) => {
                switch (name) {
                    case "roundTime":
                        return <th key={index}>{t("roundTime")}</th>;
                    case "round":
                        return <th key={index}>{t("round")}</th>;
                    case "result":
                        return <th key={index}>{t("result")}</th>;
                    case "choice":
                        return <th key={index}>{t("choice")}</th>;
                    case "stake":
                        return <th key={index}>{t("stake")}</th>;
                    case "refund":
                        return (
                            <th key={index}>
                                {t("stake")} <br></br> {t("refund")}
                            </th>
                        );
                    case "totalStake":
                        return <th key={index}>{t("totalStake")}</th>;
                    case "betType":
                        return <th key={index}>{t("betType")}</th>;
                    case "betChoice":
                        return <th key={index}>{t("betChoice")}</th>;
                    case "win":
                        return <th key={index}>{t("win")}</th>;
                    default:
                        return <></>;
                }
            })}
        </tr>
    );
};

const sendPostBetHistory = async ({
    gameId,
    gameSetting,
    proxy,
    session,
    page,
    setIsFirstLoad,
    router,
    setListBetHistory,
    listBetHistory,
}) => {
    const pathUrlHistory = GamesIdKenoMatch.includes(gameId)
        ? `${gameSetting.socketInfo.path}/api/${gameSetting.socketInfo.namespace}/history`
        : `${gameSetting.socketInfo.path}/api/history`;
    const historyAPI = `${proxy.ssl ? "https" : "http"}://${proxy.uri + proxy.path}/${pathUrlHistory}`;
    isFetchingHistory = true;
    try {
        const resp = await axios.post(historyAPI, {
            session: session.ss,
            page: page,
            pageSize: NUMBER_ROWS_DISPLAY,
            username: session.username,
        });
        const bets = resp.data.history;
        fetchBetHistory({ betHistory: bets, setListBetHistory, listBetHistory });
        setIsFirstLoad(false);
        if (page === 1) {
            totalPage = Math.ceil(bets.total / NUMBER_ROWS_DISPLAY);
        }
    } catch (err) {
        if (err?.response?.status === 401) {
            clearSession();
            router.push("/timeout");
        }
    }
};

const fetchBetHistory = ({ betHistory, setListBetHistory, listBetHistory }) => {
    if (betHistory && betHistory.betLogs.length > 0) {
        const data = betHistory.betLogs;
        setListBetHistory([...listBetHistory, ...data]);

        isFetchingHistory = false;
    }
};

const getHeaderName = ({ nameHeaderOnTable, isRefund }) => {
    const headerNameDefault = ["roundTime", "round", "result", "choice", isRefund ? "refund" : "stake", "win"];
    return nameHeaderOnTable ? nameHeaderOnTable : headerNameDefault;
};

const handleScrollBetHistory = ({ event, page, setPage }) => {
    if (Math.ceil(event.target.offsetHeight + event.target.scrollTop) > event.target.scrollHeight - InfiniteLoadBeginEdgeOffset) {
        return;
    }

    if (page + 1 <= totalPage && !isFetchingHistory) {
        setPage(page + 1);
    }
};

const BetHistoryContainer = (props: PropsBetContainer) => {
    const { renderResult, isRefund, gameId, renderResultDetail, renderBetLogsDetails, closeModal } = props;
    let { renderBet } = props;
    if (!props.renderBet) {
        renderBet = renderBetBase;
    }
    const router = useRouter();
    const { session } = useAuthContext();
    const [listBetHistory, setListBetHistory] = useState<object[]>([]);
    const [page, setPage] = useState<number>(1);
    const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);
    const [isShowResultDetail, setIsShowResultDetail] = useState<boolean>(false);
    const [betLog, setBetLog] = useState<ResultDetail>();
    const [isShowBetLogDetails, setIsShowBetLogDetails] = useState<boolean>(false);
    const headerName = getHeaderName({ nameHeaderOnTable: props.nameHeaderOnTable, isRefund });
    const gameSetting = appSettings.gameSettings[gameId];
    const gameName = gameSetting.gameName.toLowerCase();
    const { t } = useTranslation(["bethistory", gameName]);

    useEffect(() => {
        sendPostBetHistory({
            gameId,
            gameSetting,
            proxy: appSettings?.proxy,
            session,
            page,
            setIsFirstLoad,
            router,
            listBetHistory,
            setListBetHistory,
        });
    }, [page]);

    return useMemo(() => {
        const closeModalResultDetail = () => {
            setIsShowResultDetail(false);
        };

        const closeModalBetLogDetails = () => {
            setIsShowBetLogDetails(false);
        };

        return (
            <>
                {isFirstLoad ? (
                    <div className={Styles["history-loading"]}>
                        <Loader></Loader>
                    </div>
                ) : listBetHistory.length > 0 && !isShowBetLogDetails ? (
                    <div
                        className="table-container react-infinite-table"
                        onScroll={(e) => handleScrollBetHistory({ event: e, page, setPage })}
                    >
                        <table key={uuidv4()} className="table text-center">
                            <thead>{renderHeaderRows({ headerName, t })}</thead>
                            <tbody>
                                {listBetHistory.map((bet: BetLogs) => {
                                    return (
                                        <tr key={bet.phien} className={bet.betwin > 0 ? "highlight" : ""}>
                                            {renderCellOnTable({
                                                betHistoryItem: bet,
                                                renderResult: renderResult,
                                                renderBet: renderBet,
                                                setIsShowResultDetail: setIsShowResultDetail,
                                                setIsShowBetLogDetails: setIsShowBetLogDetails,
                                                setBetLog: setBetLog,
                                                gameName: gameName,
                                                t: t,
                                                headerName: headerName,
                                            })}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    !isShowBetLogDetails && t("noBetHistory")
                )}

                {!renderBetLogsDetails && isShowResultDetail && renderResultDetail(betLog, t, closeModalResultDetail, gameName)}

                {isShowBetLogDetails && (
                    <BetHistoryDetailsContainer
                        renderBetLogsDetails={renderBetLogsDetails({ betLog, gameName, t, setIsShowResultDetail })}
                        renderResultDetail={renderResultDetail(betLog, t, closeModalResultDetail, gameName)}
                        isShowResultDetail={isShowResultDetail}
                        closeModalBetDetails={closeModalBetLogDetails}
                        closeModalBetHistory={closeModal}
                        translateText={{ betDetails: t("betDetails") }}
                    ></BetHistoryDetailsContainer>
                )}
            </>
        );
    }, [isFirstLoad, listBetHistory, isShowResultDetail, isShowBetLogDetails]);
};

export default BetHistoryContainer;
