import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "next-i18next";
import Moment from "react-moment";
import { BetLogs, BetHistoryItem, PropsBetContainer, CellProps } from "./bet-history";
import { useGameContext } from "../../../contexts/game-context/game-context";
import { numberWithCommas } from "../../../helpers/NumberHelper";
import { Table } from "react-infinite-table";
import { Spinner } from "reactstrap";
import axios from "axios";
import appSettings from "../../../common/app-settings";
import { useAuthContext } from "../../../contexts/auth";
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
                <div className={bet.betwin > 0 ? "font-weight-medium" : ""}>{bet.amount}</div>
                <div className={bet.refund > 0 ? Styles["refund"] : ""}>{bet.refund}</div>
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

    const cellRenderer = ({ columnIndex, rowData }: CellProps) => {
        const { time, phien, betwin } = rowData;
        switch (columnIndex) {
            case OrderRenderCell.roundTime:
                return (
                    <td className={`${betwin > 0 ? "highlight" : ""}`}>
                        <div className="time">{time && <Moment format="hh:mm">{time}</Moment>}</div>
                        <div className="date">{time && <Moment format="DD/MM/YY">{time}</Moment>}</div>
                    </td>
                );

            case OrderRenderCell.round:
                return <td className={`${betwin > 0 ? "highlight" : ""}`}>{phien}</td>;

            case OrderRenderCell.result:
                return <td className={`${betwin > 0 ? "highlight" : ""}`}>{renderResult(rowData)}</td>;

            case OrderRenderCell.choice:
                return (
                    <td className={`${betwin > 0 ? "highlight" : ""}`}>
                        <div className={Styles["list-choices"]}>{renderBet(rowData, translate, odds)}</div>
                    </td>
                );

            case OrderRenderCell.refundOrStake:
                return (
                    <td className={`${betwin > 0 ? "highlight" : ""} ${Styles["stake"]}`}>
                        {isRefund ? renderStakeRefund(rowData) : renderStake(rowData)}
                    </td>
                );
            default:
                return (
                    <td className={`${betwin > 0 ? "highlight font-weight-medium" : ""} ${Styles["bet-win"]}`}>
                        {betwin && numberWithCommas(betwin)}
                    </td>
                );
        }
    };

    const headerRenderer = ({ column, className, columnIndex }) => {
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
                const bets = res.data.history;
                setBetHistory(bets);
                if (page === 1) {
                    setTotalPage(Math.ceil(bets.total / bets.pageSize));
                }
            });
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
