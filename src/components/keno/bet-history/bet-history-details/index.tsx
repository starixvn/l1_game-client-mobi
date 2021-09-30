import React from "react";

import { renderHeaderRows } from "../../../dashboard/history/bet-history";
import RenderRowKenoMatch from "../../../games/keno-match/bet-history/bet-history-details";
import RenderRowKenoPower from "../../../games/keno-power/bet-history/bet-history-details";
import { KenoMatchId, GetTranslateMapping } from "../../keno.helper";
import Styles from "../bet-history.module.scss";

const BetLogsDetails = ({ betLog, gameName, t, setIsShowResultDetail, gameId }) => {
    if (betLog) {
        const { bet, roundId } = betLog;
        const { betLogDetails } = bet ?? [];
        const headerName = ["roundTime", "betType", "betChoice", "refund"];
        const renderRow = KenoMatchId.includes(gameId) ? RenderRowKenoMatch : RenderRowKenoPower;

        const clickOpenDetails = () => {
            setIsShowResultDetail(true);
        };

        const translateMapping = GetTranslateMapping(t, gameName);

        return (
            <>
                <div className={Styles["top-title"]}>
                    <div>
                        {t(`${gameName}:game_name`)} - {t("round")}: {roundId}
                    </div>
                    <div onClick={() => clickOpenDetails()} data-testid="info-results-details">
                        {t("result")}:<span className={Styles["details"]}>{t("details")}</span>
                    </div>
                </div>
                <div className={`table-container react-infinite-table ${Styles["bet-logs-table"]}`} data-testid="bet-history-details">
                    <table className="table text-center">
                        <thead>{renderHeaderRows({ headerName, t })}</thead>
                        <tbody>
                            {betLogDetails?.length > 0 &&
                                betLogDetails.map((betLog: any, index: number) => {
                                    return (
                                        <tr key={index} className={bet.betwin > 0 ? "highlight" : ""}>
                                            {renderRow({
                                                betDetail: betLog,
                                                bet: bet,
                                                translateMapping: translateMapping,
                                            })}
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                </div>
            </>
        );
    }
    return <></>;
};

export default BetLogsDetails;
