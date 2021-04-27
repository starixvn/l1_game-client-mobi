import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "next-i18next";
import Moment from "react-moment";
import { BetHistoryItem } from "./bet-history";
import { useGameContext } from "../../../contexts/game-context/game-context";
import { numberWithCommas } from "../../../helpers/NumberHelper";
import Styles from "./bet-history.module.scss";
import { Table } from "react-infinite-table";
import { Spinner } from "reactstrap";
import axios from "axios";
import appSettings from "../../../common/app-settings";
import { useAuthContext } from "../../../contexts/auth";

const renderStake = (bet: any) => {
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

const renderStakeRefund = (bet: any) => {
    if (bet.settlementResult) {
        return (
            <>
                <div className={bet.betwin > 0 ? "font-weight-medium" : ""}>{bet.amount}</div>
                <div className={bet.refund > 0 ? Styles["refund"] : ""}>{bet.refund}</div>
            </>
        );
    }

    return <></>;
};

const renderBetBase = (bet: any, t: Function, mainOdds: object) => {
    if (bet.settlementResult) {
        const keysChoices = Object.keys(bet.settlementResult);
        const odds = bet.odds ? bet.odds : mainOdds;
        return (
            <>
                {keysChoices &&
                    keysChoices.map((name, index) => {
                        const classHighLight = bet.settlementResult[name] ? "font-weight-medium" : "";
                        if (bet[name] > 0) {
                            return (
                                <div key={index} className={classHighLight}>
                                    {t(name)}
                                    {odds[name] ? "@" + odds[name] : ""}
                                </div>
                            );
                        }
                        return "";
                    })}
            </>
        );
    }

    return <></>;
};

export type PropsBetContainer = {
    isRefund: boolean;
    renderResult: Function;
    translate?: Function;
    renderBet?: Function;
};

const BetHistoryContainer = (props: PropsBetContainer) => {
    const { renderResult, isRefund, translate } = props;
    let { renderBet } = props;
    if (!props.renderBet) {
        renderBet = renderBetBase;
    }
    const { gameConfigs, gameSetting } = useGameContext();
    const historyAPI = `${appSettings.ssl ? "https" : "http"}://${appSettings.proxyUrl}/${gameSetting.socketInfo.path}/api/history`;
    const { session } = useAuthContext();
    const [listBetHistory, setListBetHistory] = useState<object[]>([{}]);
    const [columns, setColumns] = useState<object[]>([]);
    const [page, setPage] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [isInfiniteLoading, setIsInfiniteLoading] = useState<boolean>(false);
    const [stakeLocation, setStakeLocation] = useState<number>(-1);
    const [betHistory, setBetHistory] = useState<any>();

    const { t } = useTranslation("bethistory");

    const odds = gameConfigs.odds;
    const headerName = ["roundTime", "round", "result", "choice", isRefund ? "refund" : "stake", "win"];

    const cellRenderer = ({ columnIndex, rowData }) => {
        const { time, phien, betwin, refund, amount, totalAmount } = rowData as BetHistoryItem;
        switch (columnIndex) {
            case 1:
                return <td className={`${betwin > 0 ? "highlight" : ""}`}>{phien}</td>;
            case 2:
                return <td className={`${betwin > 0 ? "highlight" : ""}`}>{renderResult(rowData)}</td>;
            case 3:
                return (
                    <td className={`${betwin > 0 ? "highlight" : ""}`}>
                        <div className={Styles["list-choices"]}>{renderBet(rowData, translate, odds)}</div>
                    </td>
                );
            case 4:
                return (
                    <td className={`${betwin > 0 ? "highlight" : ""} ${Styles["stake"]}`}>
                        {isRefund ? renderStakeRefund(rowData) : renderStake(rowData)}
                    </td>
                );
            case 5:
                return (
                    <td className={`${betwin > 0 ? "highlight font-weight-medium" : ""} ${Styles["bet-win"]}`}>
                        {betwin && numberWithCommas(betwin)}
                    </td>
                );

            default:
                return (
                    <td className={`${betwin > 0 ? "highlight" : ""}`}>
                        <div className="time">{time && <Moment format="hh:mm">{time}</Moment>}</div>
                        <div className="date">{time && <Moment format="DD/MM/YY">{time}</Moment>}</div>
                    </td>
                );
        }
    };

    const headerRenderer = (props) => {
        const { column, className, columnIndex, rowData } = props;
        return <td className={stakeLocation === columnIndex ? Styles["stake-width"] : className}>{t(headerName[column.i])}</td>;
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

    const fetchBetHistory = async () => {
        if (betHistory && betHistory.betLogs.length > 0) {
            const data = betHistory.betLogs;
            if (page === betHistory.page) {
                setListBetHistory([...listBetHistory, ...data]);
                setColumns(createColumns());
            }
        }
    };

    const onInfiniteLoad = async () => {
        setIsInfiniteLoading(true);
        if (page + 1 <= totalPage) {
            setPage(page + 1);
        }
        setIsInfiniteLoading(false);
    };

    useEffect(() => {
        axios
            .get(historyAPI, {
                params: {
                    session: session.ss,
                    page: 1,
                    pageSize: 8,
                    username: session.username,
                },
            })
            .then((res) => {
                const bets = res.data.history;
                setBetHistory(bets);
                setTotalPage(Math.ceil(bets.total / bets.pageSize));
            });
    }, []);

    useEffect(() => {
        fetchBetHistory();
    }, [betHistory]);

    useEffect(() => {
        if (page <= totalPage) {
            setIsInfiniteLoading(false);
            axios
                .get(historyAPI, {
                    params: {
                        session: session.ss,
                        page: page,
                        pageSize: 8,
                        username: session.username,
                    },
                })
                .then((res) => {
                    setBetHistory(res.data.history);
                });
        }
    }, [page]);

    return (
        <div className="table-container">
            {listBetHistory.length > 1 ? (
                <Table
                    className="table"
                    tableClassName="table text-center"
                    height={400}
                    rowHeight={50}
                    rows={listBetHistory}
                    columns={columns}
                    fillTableWidth={true}
                    noRowsRenderer={() => t("noBetHistory")}
                    infiniteLoadBeginEdgeOffset={5}
                    isInfiniteLoading={isInfiniteLoading}
                    onInfiniteLoad={onInfiniteLoad}
                    getLoadingSpinner={() => <Spinner color="primary" />}
                />
            ) : (
                t("noBetHistory")
            )}
        </div>
    );
};

export default BetHistoryContainer;
