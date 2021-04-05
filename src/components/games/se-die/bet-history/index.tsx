import React from "react";
import Styles from "./bet-history.module.scss";
import { GameContext, useGameContext } from "../../../../contexts/game-context/game-context";

type Props = {
    gameContext?: any;
};

const SeDieTicketHistory: React.FunctionComponent<Props> = () => {
    const gameContext = useGameContext();
    return (
        <div className="table-container">
            <table className="table text-center">
                <thead>
                    <tr>
                        <th>Thời gian</th>
                        <th>Phiên</th>
                        <th>Kết quả</th>
                        <th>Cược</th>
                        <th>Trả lại</th>
                        <th>Thắng</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <div className={Styles["time"]}>13:49</div>
                            <div className={Styles["date"]}>25/03/21</div>
                        </td>
                        <td>801802</td>
                        <td>
                            <div className="d-flex justify-content-center">
                                <span className={Styles["dot-red"]}>4</span>
                            </div>
                        </td>
                        <td>
                            <div className={Styles["list-choices"]}>
                                <div className={Styles["choice"]}>
                                    <span className={Styles["dot-red"]}>4</span>
                                    <span className={Styles["bet-amount"]}>10</span>
                                </div>
                            </div>
                        </td>
                        <td>0</td>
                        <td>0</td>
                    </tr>
                    <tr className="highlight">
                        <td>
                            <div className={Styles["time"]}>13:49</div>
                            <div className={Styles["date"]}>25/03/21</div>
                        </td>
                        <td>801802</td>
                        <td>
                            <div className="d-flex justify-content-center">
                                <span className={Styles["dot-red"]}>4</span>
                            </div>
                        </td>
                        <td>
                            <div className={Styles["list-choices"]}>
                                <div className={Styles["choice"]}>
                                    <span className={Styles["dot-red"]}>4</span>
                                    <span className={Styles["bet-amount"]}>10</span>
                                </div>
                            </div>
                        </td>
                        <td>0</td>
                        <td>0</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default SeDieTicketHistory;
