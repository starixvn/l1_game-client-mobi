import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "next-i18next";
import Moment from "react-moment";
import { PropsBetContainer, Props, BetHistoryItem } from "./bet-history";
import { useGameContext } from "../../../contexts/game-context/game-context";
import { GameBetHistory } from "../../../components/shared/game-base/type";
import { useGameActionContext } from "../../../contexts/game-actions-context";
import InfiniteScroll from "react-infinite-scroll-component";
import Styles from "./bet-history.module.scss";

const BetHistoryContainer = (props: PropsBetContainer) => {
    const { renderResult, renderBet, isRefund } = props;
    const gameContext = useGameContext();
    const gameActions = useGameActionContext();
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const [listBetHistory, setListBetHistory] = useState<any[]>([]);
    const [page, setPage] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [hasMoreHistory, setHasMoreHistory] = useState<boolean>(false);
    const betHistory: GameBetHistory = gameContext.betHistory;
    const { t } = useTranslation("bethistory");

    useEffect(() => {
        gameActions.getBetHistory(1);
    }, []);

    useEffect(() => {
        if (listBetHistory.length > 0 && listBetHistory.length % 8 > 0) {
            setHasMoreHistory(false);
        }
    }, [page === 1]);

    useEffect(() => {
        fetchBetHistory();
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
                setHasMoreHistory(true);
            }
        }
        return;
    };

    const fetchMoreListBets = () => {
        if (page <= totalPage) {
            gameActions.getBetHistory(page);
            fetchBetHistory();
            return;
        }
        setHasMoreHistory(false);
    };

    return (
        <div className="table-container">
            {listBetHistory && (
                <InfiniteScroll
                    dataLength={listBetHistory.length}
                    next={fetchMoreListBets}
                    hasMore={hasMoreHistory}
                    loader={<h4>Loading...</h4>}
                    scrollThreshold={0.1}
                    className={"tableFixHead"}
                >
                    <table className="table text-center">
                        <thead>
                            <tr>
                                <th>{t("roundTime")}</th>
                                <th>{t("round")}</th>
                                <th>{t("result")}</th>
                                <th>{t("choice")}</th>
                                {isRefund ? <th>t("refund")</th> : null}
                                <th>{t("win")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listBetHistory.map((bet: any) => {
                                return (
                                    <BetHistoryRow
                                        key={bet.phien}
                                        renderResult={() => renderResult(bet)}
                                        renderBet={() => renderBet(bet)}
                                        betHistoryItem={bet}
                                        isRefund={false}
                                    ></BetHistoryRow>
                                );
                            })}
                        </tbody>
                    </table>
                </InfiniteScroll>
            )}

            {isFetching && <h1>Fetching bets history...</h1>}
        </div>
    );
};

const BetHistoryRow: React.FunctionComponent<Props> = (props: Props) => {
    const { betHistoryItem, renderResult, renderBet, isRefund } = props;
    const { time, phien, betwin, refund, amount, totalAmount } = betHistoryItem as BetHistoryItem;
    return (
        <tr className={betwin > 0 ? "highlight" : ""}>
            <td>
                <div className="time">
                    <Moment format="hh:mm">{time}</Moment>
                </div>
                <div className="date">
                    <Moment format="DD/MM/YY">{time}</Moment>
                </div>
            </td>
            <td>{phien}</td>
            <td>{renderResult()}</td>
            <td>
                <div className={Styles["list-choices"]}>{renderBet()}</div>
            </td>
            {isRefund ? <td>{refund}</td> : null}
            <td>{betwin}</td>
        </tr>
    );
};

export default BetHistoryContainer;
