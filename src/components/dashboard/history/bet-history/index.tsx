import axios from "axios";
import { useTranslation, TFunction } from "next-i18next";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { Table } from "react-infinite-table";

import appSettings from "../../../../common/app-settings";
import { useAuthContext } from "../../../../contexts/auth";
import { numberWithCommas } from "../../../../helpers/number-helper";
import { formatDate } from "../../../../helpers/time-helper";
import { clearSession } from "../../../../services/auth-service";
import { BetLogs, PropsBetContainer } from "./bet-history";
import Styles from "./bet-history.module.scss";

enum OrderRenderCell {
    roundTime = 0,
    round,
    result,
    choice,
    refundOrStake,
    win,
}

const fontWeightClass = "font-weight-medium";

export const RenderResultContainer: React.FC = ({ children }) => {
    return <div className={Styles["popup-result-detail"]}>{children}</div>;
};

export const FormatNumber: React.FC = ({ children }) => {
    return <span className="font-number nowrap">{children}</span>;
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

const renderBetBase = (bet: BetLogs, t: Function, mainOdds: object) => {
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
                                    {t(name)}@<FormatNumber>{odds[name] ? `${odds[name]}` : ""}</FormatNumber>
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

const checkCondition = (
    columnIndex: number,
    rowData: BetLogs,
    isRefund: boolean,
    renderResult: (
        rowData: BetLogs,
        roundId?: number,
        setShowResultDetail?: Function,
        setResultDetail?: Function,
        translate?: TFunction
    ) => JSX.Element,
    renderBet: (rowData: BetLogs, translate: TFunction, odds: object) => {},
    translate: TFunction,
    setShowResultDetail: Function,
    setResultDetail: Function
) => {
    const { time, phien, betwin } = rowData;
    const odds = rowData.odds;
    const isHighligh = betwin > 0 ? true : false;
    const fontNumber = "font-number";
    switch (columnIndex) {
        case OrderRenderCell.roundTime:
            return renderDataOnCell(
                <FormatNumber>
                    <div className="time">{time && formatDate(new Date(time), "hh:mm:ss")}</div>
                    <div className="date">{time && formatDate(new Date(time), "dd/MM/yy")}</div>
                </FormatNumber>,

                isHighligh
            );

        case OrderRenderCell.round:
            return renderDataOnCell(<FormatNumber>{phien}</FormatNumber>, isHighligh);

        case OrderRenderCell.result:
            return renderDataOnCell(renderResult(rowData, phien, setShowResultDetail, setResultDetail, translate), isHighligh);

        case OrderRenderCell.choice:
            return renderDataOnCell(renderBet(rowData, translate, odds), isHighligh);

        case OrderRenderCell.refundOrStake:
            return renderDataOnCell(
                <div className={`${Styles["stake"]} ${fontNumber}`}>{isRefund ? renderStakeRefund(rowData) : renderStake(rowData)}</div>,
                isHighligh
            );
        default:
            const classBetWin = `font-weight-medium ${Styles["bet-win"]} ${fontNumber}`;
            return renderDataOnCell(<div className={classBetWin}> {betwin && numberWithCommas(betwin)}</div>, isHighligh);
    }
};

const BetHistoryContainer = (props: PropsBetContainer) => {
    const { renderResult, isRefund, translate, gameId, gameName, renderResultDetail } = props;
    const router = useRouter();
    let { renderBet } = props;
    if (!props.renderBet) {
        renderBet = renderBetBase;
    }
    const gameSetting = appSettings.gameSettings[gameId];
    const { proxy } = appSettings;
    const historyAPI = `${proxy.ssl ? "https" : "http"}://${proxy.uri + proxy.path}/${gameSetting.socketInfo.path}/api/history`;
    const { session } = useAuthContext();
    const [listBetHistory, setListBetHistory] = useState<object[]>([{}]);
    const [columns, setColumns] = useState<object[]>([]);
    const [page, setPage] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [isInfiniteLoading, setIsInfiniteLoading] = useState<boolean>(false);
    const [stakeLocation, setStakeLocation] = useState<number>(-1);
    const [heightHistory, setHeightHistory] = useState<number>(0);
    const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);
    const [showResultDetail, setShowResultDetail] = useState<boolean>(false);
    const [resultDetail, setResultDetail] = useState<any>();
    const wrapperRef = useRef<HTMLDivElement>(null);
    const { t } = useTranslation("bethistory");
    const headerName = ["roundTime", "round", "result", "choice", isRefund ? "refund" : "stake", "win"];
    const headerObjectName = {
        refund: "refund",
    };
    const [isFetchingData, setIsFetchingData] = useState<boolean>(false);

    const closeModalResultDetail = () => {
        setShowResultDetail(false);
    };

    const cellRenderer = ({ columnIndex, rowData }) => {
        return checkCondition(columnIndex, rowData, isRefund, renderResult, renderBet, translate, setShowResultDetail, setResultDetail);
    };

    const headerRenderer = ({ column, className, columnIndex }) => {
        return (
            <td className={stakeLocation === columnIndex ? Styles["stake-width"] : className}>
                {headerName[column.i] === headerObjectName.refund && <div>{t("stake")}</div>}
                {t(headerName[column.i])}
            </td>
        );
    };

    const createColumns = () => {
        const _columns = [];
        for (let index = 0; index < headerName.length; index++) {
            if (headerName[index] === "stake") {
                setStakeLocation(index);
            }
            _columns.push({
                i: index,
                cellRenderer: cellRenderer,
                headerRenderer: headerRenderer,
                width: 50,
            });
        }
        return _columns;
    };

    const onInfiniteLoad = () => {
        setIsInfiniteLoading(true);
        if (page + 1 <= totalPage && !isFetchingData) {
            setPage(page + 1);
        }
        setIsInfiniteLoading(false);
    };

    useEffect(() => {
        const sendPostBetHistory = async () => {
            setIsFetchingData(true);
            try {
                const resp = await axios.post(historyAPI, {
                    session: session.ss,
                    page: page,
                    pageSize: 16,
                    username: session.username,
                });
                const bets = resp.data.history;
                fetchBetHistory(bets);
                setIsFirstLoad(false);
                if (page === 1) {
                    setTotalPage(Math.ceil(bets.total / 16));
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
                setColumns(createColumns());
                setIsFetchingData(false);
                setIsInfiniteLoading(false);
            }
        };

        sendPostBetHistory();
    }, [page]);

    useEffect(() => {
        function handleResize() {
            if (wrapperRef.current) {
                setHeightHistory(wrapperRef.current.clientHeight);
            }
        }

        window.addEventListener("resize", handleResize);
        handleResize();

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [wrapperRef]);

    return (
        <div className="table-container" ref={wrapperRef}>
            {isFirstLoad ? (
                <div className={Styles["history-loading"]}>
                    <span className={Styles["spinner"]} />
                </div>
            ) : listBetHistory.length > 1 ? (
                <Table
                    className="table"
                    tableClassName="table text-center"
                    height={heightHistory}
                    rowHeight={40}
                    rows={listBetHistory}
                    columns={columns}
                    fillTableWidth={true}
                    noRowsRenderer={() => t("noBetHistory")}
                    infiniteLoadBeginEdgeOffset={100}
                    isInfiniteLoading={isInfiniteLoading}
                    onInfiniteLoad={onInfiniteLoad}
                    getLoadingSpinner={() => <span className={Styles["spinner"]} />}
                />
            ) : (
                t("noBetHistory")
            )}
            {showResultDetail && renderResultDetail(resultDetail, translate, gameName, closeModalResultDetail)}
        </div>
    );
};

export default BetHistoryContainer;
