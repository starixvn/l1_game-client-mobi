import axios from "axios";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { Table } from "react-infinite-table";
import Moment from "react-moment";
import { Spinner } from "reactstrap";
import appSettings from "../../../common/app-settings";
import { useAuthContext } from "../../../contexts/auth";
import { useGameContext } from "../../../contexts/game-context/game-context";
import { numberWithCommas } from "../../../helpers/number-helper";
import { BetLogs, PropsBetContainer } from "./bet-history";
import { signOut } from "../../../pages";
import Styles from "./bet-history.module.scss";

enum OrderRenderCell {
    roundTime = 0,
    round,
    result,
    choice,
    refundOrStake,
    win,
}
const renderStake = (bet: BetLogs) => {
    if (bet.settlementResult) {
        const keysChoices = Object.keys(bet.settlementResult);
        return (
            <>
                {keysChoices.map((name, index) => {
                    if (bet[name] > 0) {
                        return (
                            <div key={index} className={bet.settlementResult[name] ? "font-weight-medium" : ""}>
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
                <div className={bet.betwin > 0 ? "font-weight-medium" : ""}>{numberWithCommas(bet.amount)}</div>
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
                        const classHighLight = bet.settlementResult[name] ? "font-weight-medium" : "";
                        if (bet[name] > 0) {
                            return (
                                <div key={index} className={classHighLight}>
                                    {t(name)}
                                    {odds[name] ? `@${odds[name]}` : ""}
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
    gameConfigs: any,
    renderResult: Function,
    renderBet: (rowData: BetLogs, translate: Function, odds: object) => {},
    translate: Function
) => {
    const { time, phien, betwin } = rowData;
    const odds = gameConfigs.odds;
    const isHighligh = betwin > 0 ? true : false;
    switch (columnIndex) {
        case OrderRenderCell.roundTime:
            return renderDataOnCell(
                <>
                    <div className="time">{time && <Moment format="HH:mm:ss">{time}</Moment>}</div>
                    <div className="date">{time && <Moment format="DD/MM/YY">{time}</Moment>}</div>
                </>,
                isHighligh
            );

        case OrderRenderCell.round:
            return renderDataOnCell(phien, isHighligh);

        case OrderRenderCell.result:
            return renderDataOnCell(renderResult(rowData), isHighligh);

        case OrderRenderCell.choice:
            return renderDataOnCell(renderBet(rowData, translate, odds), isHighligh);

        case OrderRenderCell.refundOrStake:
            return renderDataOnCell(
                <div className={Styles["stake"]}>{isRefund ? renderStakeRefund(rowData) : renderStake(rowData)}</div>,
                isHighligh
            );
        default:
            const classBetWin = `font-weight-medium ${Styles["bet-win"]}`;
            return renderDataOnCell(<div className={classBetWin}> {betwin && numberWithCommas(betwin)}</div>, isHighligh);
    }
};

const BetHistoryContainer = (props: PropsBetContainer) => {
    const { renderResult, isRefund, translate } = props;
    const router = useRouter();
    let { renderBet } = props;
    if (!props.renderBet) {
        renderBet = renderBetBase;
    }
    const { gameConfigs, gameSetting } = useGameContext();
    const { proxy } = appSettings;
    const historyAPI = `${proxy.ssl ? "https" : "http"}://${proxy.uri + proxy.path}/${gameSetting.socketInfo.path}/api/history`;
    const { session } = useAuthContext();
    const [listBetHistory, setListBetHistory] = useState<object[]>([{}]);
    const [columns, setColumns] = useState<object[]>([]);
    const [page, setPage] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [isInfiniteLoading, setIsInfiniteLoading] = useState<boolean>(false);
    const [stakeLocation, setStakeLocation] = useState<number>(-1);
    const [betHistory, setBetHistory] = useState<any>();
    const [heightHistory, setHeightHistory] = useState<number>(0);
    const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);
    const paddingBottom = 6;
    const wrapperRef = useRef<HTMLDivElement>(null);
    const { t } = useTranslation("bethistory");
    const headerName = ["roundTime", "round", "result", "choice", isRefund ? "refund" : "stake", "win"];
    const headerObjectName = {
        refund: "refund",
    };

    const cellRenderer = ({ columnIndex, rowData }) => {
        return checkCondition(columnIndex, rowData, isRefund, gameConfigs, renderResult, renderBet, translate);
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

    const fetchBetHistory = () => {
        if (betHistory && betHistory.betLogs.length > 0) {
            const data = betHistory.betLogs;
            if (page === betHistory.page) {
                setListBetHistory([...listBetHistory, ...data]);
                setColumns(createColumns());
            }
        }
    };

    const onInfiniteLoad = () => {
        setIsInfiniteLoading(true);
        if (page + 1 <= totalPage) {
            setPage(page + 1);
        }
        setIsInfiniteLoading(false);
    };

    useEffect(() => {
        fetchBetHistory();
    }, [betHistory]);

    useEffect(() => {
        setIsInfiniteLoading(false);
        session &&
            axios
                .post(historyAPI, {
                    session: session.ss,
                    page: page,
                    pageSize: 16,
                    username: session.username,
                })
                .then((res) => {
                    const bets = res.data.history;
                    setBetHistory(bets);
                    setIsFirstLoad(false);
                    if (page === 1) {
                        setTotalPage(Math.ceil(bets.total / 16));
                    }
                })
                .catch((error) => {
                    if (error.response.status === 401) {
                        signOut();
                        router.push("/timeout");
                    }
                });
    }, [page]);

    useEffect(() => {
        function handleResize() {
            if (wrapperRef.current) {
                setHeightHistory(wrapperRef.current.clientHeight - paddingBottom);
            }
        }

        window.addEventListener("resize", handleResize);
        handleResize();

        return () => {
            wrapperRef.current = null;
            window.removeEventListener("resize", handleResize);
        };
    }, [wrapperRef]);

    return (
        <div className="table-container" ref={wrapperRef}>
            {isFirstLoad ? (
                <div className={Styles["history-loading"]}>
                    <Spinner color="secondary" />
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
                    infiniteLoadBeginEdgeOffset={5}
                    isInfiniteLoading={isInfiniteLoading}
                    onInfiniteLoad={onInfiniteLoad}
                    getLoadingSpinner={() => <Spinner color="secondary" />}
                />
            ) : (
                t("noBetHistory")
            )}
        </div>
    );
};

export default BetHistoryContainer;
