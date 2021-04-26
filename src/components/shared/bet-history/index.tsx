import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "next-i18next";
import Moment from "react-moment";
import { PropsBetContainer, Props, BetHistoryItem } from "./bet-history";
import { useGameContext } from "../../../contexts/game-context/game-context";
import { GameBetHistory } from "../../../components/shared/game-base/type";
import { useGameActionContext } from "../../../contexts/game-actions-context";
import { numberWithCommas } from "../../../helpers/NumberHelper";
// import InfiniteScroll from "react-infinite-scroll-component";
import Styles from "./bet-history.module.scss";
import { Table } from "react-infinite-table";
import { Spinner } from "reactstrap";

const BetHistoryContainer = (props: PropsBetContainer) => {
    const { renderResult, renderBet, renderStake, isRefund, translate } = props;
    const gameContext = useGameContext();
    const gameActions = useGameActionContext();
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const [listBetHistory, setListBetHistory] = useState<any[]>([]);
    const [columns, setColumns] = useState<any[]>([]);
    const [page, setPage] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [isInfiniteLoading, setIsInfiniteLoading] = useState<boolean>(false);
    const betHistory: GameBetHistory = gameContext.betHistory;
    const { t } = useTranslation("bethistory");
    const { gameConfigs } = useGameContext();
    const odds = gameConfigs.odds;
    const headerName = ["roundTime", "round", "result", "choice", isRefund ? "refund" : "stake", "win"];
    const cellRenderer = ({ columnIndex, rowData }) => {
        const { time, phien, betwin, refund, amount, totalAmount } = rowData as BetHistoryItem;
        switch (columnIndex) {
            case 1:
                return <td className={`${betwin > 0 ? "highlight" : ""}`}>{phien}</td>;
                break;
            case 2:
                return <td className={`${betwin > 0 ? "highlight" : ""}`}>{renderResult(rowData)}</td>;
                break;
            case 3:
                return (
                    <td className={`${betwin > 0 ? "highlight" : ""}`}>
                        <div className={Styles["list-choices"]}>{renderBet(rowData, translate, odds)}</div>
                    </td>
                );
                break;
            case 4:
                return <td className={`${betwin > 0 ? "highlight" : ""} ${Styles["stake"]}`}>{renderStake(rowData)}</td>;
                break;
            case 5:
                return (
                    <td className={`${betwin > 0 ? "highlight font-weight-medimum" : ""} ${Styles["bet-win"]}`}>
                        {numberWithCommas(betwin)}
                    </td>
                );
                break;

            default:
                return (
                    <td className={`${betwin > 0 ? "highlight" : ""}`}>
                        <div className="time">
                            <Moment format="hh:mm">{time}</Moment>
                        </div>
                        <div className="date">
                            <Moment format="DD/MM/YY">{time}</Moment>
                        </div>
                    </td>
                );
                break;
        }
    };

    const headerRenderer = ({ column, className }) => {
        return <td className={className}>{t(headerName[column.i])}</td>;
    };

    const createColumns = () => {
        const numberOfColumns = isRefund ? 7 : 6;
        const _columns = [];
        for (let index = 0; index < numberOfColumns; index++) {
            _columns.push({
                i: index,
                cellRenderer: cellRenderer,
                headerRenderer: headerRenderer,
                width: 50,
            });
        }
        return _columns;
    };

    useEffect(() => {
        gameActions.getBetHistory(1);
    }, []);

    useEffect(() => {
        fetchBetHistory();
        setColumns(createColumns());
    }, [betHistory]);

    const fetchBetHistory = () => {
        setIsFetching(false);
        if (betHistory && betHistory.betLogs.length > 0) {
            setTotalPage(Math.ceil(betHistory.total / betHistory.pageSize));
            const data = betHistory.betLogs;

            if (page === betHistory.page) {
                setListBetHistory(() => {
                    return [...listBetHistory, ...data];
                });

                setPage(page + 1);
                setIsInfiniteLoading(false);
            }
        }
    };

    const onInfiniteLoad = () => {
        setIsInfiniteLoading(true);
        if (page <= totalPage) {
            gameActions.getBetHistory(page);
            fetchBetHistory();
            return;
        }
        setIsInfiniteLoading(false);
    };

    return (
        <div className="table-container">
            {listBetHistory && columns && (
                <Table
                    className="table"
                    tableClassName="table text-center"
                    height={400}
                    rowHeight={36}
                    rows={listBetHistory}
                    columns={columns}
                    fillTableWidth={true}
                    noRowsRenderer={() => "No rows"}
                    infiniteLoadBeginEdgeOffset={5}
                    isInfiniteLoading={isInfiniteLoading}
                    onInfiniteLoad={onInfiniteLoad}
                    getLoadingSpinner={() => <Spinner color="primary" />}
                />
            )}

            {isFetching && <Spinner color="primary" />}
        </div>
    );
};

export default BetHistoryContainer;
