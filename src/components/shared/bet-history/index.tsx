import React from "react";
import Styles from "./bet-history.module.scss";
import { useTranslation } from "next-i18next";
import Moment from "react-moment";

type Props = {
    betHistoryItem: any;
    renderResult: Function;
    renderBet: Function;
    isRefund: boolean;
};

type BetHistoryItem = {
    time: string;
    phien: number;
    betwin: number;
    refund?: number;
    amount?: number;
    totalAmount?: number;
};

type PropsContainer = {
    isRefund: boolean;
    children: React.ReactNode;
};

export const BetHistoryContainer = (props: PropsContainer) => {
    const { isRefund } = props;
    const { t } = useTranslation("bethistory");
    return (
        <React.Fragment>
            <div className="table-container">
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
                    {props.children}
                </table>
            </div>
        </React.Fragment>
    );
};

const BetHistory: React.FunctionComponent<Props> = (props: Props) => {
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

export default BetHistory;
