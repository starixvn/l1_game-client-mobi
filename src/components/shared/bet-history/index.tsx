import React, { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import Moment from "react-moment";
import { PropsBetContainer, Props, BetHistoryItem, BetLogs } from "./bet-history";
import { useGameContext } from "../../../contexts/game-context/game-context";
import { GameBetHistory } from "../../../components/shared/game-base/type";

import Styles from "./bet-history.module.scss";

const BetHistoryContainer = (props: PropsBetContainer) => {
    const { renderResult, renderBet, isRefund } = props;
    const gameContext = useGameContext();
    const [isFetching, setIsFetching] = useState(false);
    const [listBetHistory, setListBetHistory] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const { t } = useTranslation("bethistory");
    const betHistory: GameBetHistory = gameContext.betHistory;

    useEffect(() => {
        fetchBetHistory();
    }, [betHistory]);

    const handleScroll = (e) => {
        if (Math.ceil(e.target.scrollHeight - e.target.scrollTop) !== e.target.offsetHeight || isFetching) return;
        setIsFetching(true);
    };

    const fetchBetHistory = () => {
        if (betHistory && betHistory.betLogs.length > 0) {
            setTotalPage(Math.ceil(betHistory.total / betHistory.pageSize));
            const data = betHistory.betLogs;

            if (page === betHistory.page) {
                setListBetHistory(() => {
                    return [...listBetHistory, ...data];
                });
                setPage(page + 1);
            }
        }
    };

    useEffect(() => {
        if (!isFetching) return;
        fetchMoreListBets();
    }, [isFetching]);

    const fetchMoreListBets = () => {
        if (page <= totalPage) {
            gameContext.getBetHistory(page);
            fetchBetHistory();
        }

        setIsFetching(false);
    };

    return (
        <React.Fragment>
            <div className="table-container" onWheel={(e) => handleScroll(e)}>
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
                </table>
            </div>
            {isFetching && <h1>Fetching bets history...</h1>}
        </React.Fragment>
    );
};

const BetHistoryRow: React.FunctionComponent<Props> = (props: Props) => {
    const { betHistoryItem, renderResult, renderBet, isRefund } = props;
    const { time, phien, betwin, refund, amount, totalAmount } = betHistoryItem as BetHistoryItem;
    return (
        <React.Fragment>
            <tbody>
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
            </tbody>
        </React.Fragment>
    );
};

export default BetHistoryContainer;
