import { TFunction } from "next-i18next";
import React from "react";

import ResultDetailContainer from "../../../../dashboard/history/bet-history/result-detail";
import { GameResourceKeys } from "../../../../../common/resources";
import BallsNumbers from "../../../../shared/balls-numbers";
import { calculateTotalPoint, GetTranslateMapping } from "../../keno-match-helper";
import { StateRound } from "../index";
import Styles from "../bet-history.module.scss";

const renderScoreRounds = ({ result, settlementResult, stateRound, translateMapping, total }) => {
    const { blue, red } = result;
    const isTeamRedWin = settlementResult?.red ? true : false;
    return (
        <div className={Styles["container-round"]} data-testid="score-round">
            <div className={Styles["container-blue"]}>
                <div className={Styles["score-row"]}>
                    {blue.map((number: number, index: number) => (
                        <BallsNumbers key={index} number={number} isBetHistory={true} />
                    ))}
                </div>
                <div className={Styles["blue-label"]}>
                    {!isTeamRedWin && renderIconTeamWin({ settlementResult, isTeamRedWin })}
                    {translateMapping.blue}:<span className={Styles["score"]}>{calculateTotalPoint(result.blue)}</span>
                </div>
            </div>
            <div>
                <div className={Styles["round-name"]}>
                    {stateRound === StateRound.ft ? translateMapping.fullTime : translateMapping.firstHalf}
                </div>
                <div className={Styles["total-match-section"]}>
                    {translateMapping.sum}
                    <div className={Styles["total"]}>{total}</div>
                </div>
            </div>

            <div className={Styles["container-red"]}>
                <div className={Styles["score-row"]}>
                    {red.map((number: number, index: number) => (
                        <BallsNumbers key={index} number={number} isBetHistory={true} />
                    ))}
                </div>
                <div className={Styles["red-label"]}>
                    {isTeamRedWin && renderIconTeamWin({ settlementResult, isTeamRedWin })}
                    {translateMapping.red}: <span className={Styles["score"]}>{calculateTotalPoint(result.red)}</span>
                </div>
            </div>

            <div className={Styles["winning-info"]}>
                {renderTextWinningForTeam({ settlementResult, translateMapping })}
                <div> {translateMapping.sum}</div>
                <div className={Styles["result-info"]}>{renderWinningInfo({ settlementResult, translateMapping })}</div>
            </div>
        </div>
    );
};

const renderIconTeamWin = ({ settlementResult, isTeamRedWin = false }) => {
    const renderIcons = () => {
        return isTeamRedWin ? (
            <span className={Styles["icon-win-blue"]}>
                <img
                    src={`/static/images/kenomatch/icon-check-red.svg`}
                    className={Styles["icon-check-red"]}
                    alt="icon-check-red"
                    width={12}
                    height={12}
                />
            </span>
        ) : (
            <span className={Styles["icon-win-red"]}>
                <img
                    src={`/static/images/kenomatch/icon-check-blue.svg`}
                    className={Styles["icon-check-blue"]}
                    alt="icon-check-blue"
                    width={12}
                    height={12}
                />
            </span>
        );
    };
    return <>{!settlementResult?.tie && renderIcons()}</>;
};

const renderTextWinningForTeam = ({ settlementResult, translateMapping }) => {
    return (
        <div>
            {settlementResult?.tie ? translateMapping.tie : settlementResult?.blue ? translateMapping.blueWin : translateMapping.redWin}
        </div>
    );
};

const renderWinningInfo = ({ settlementResult, translateMapping }) => {
    return Object.keys(settlementResult).map((keyName, index) => {
        if (settlementResult[keyName] && ["odd", "even", "over", "under"].includes(keyName)) {
            const classFollowKey = ["odd", "even"].includes(keyName) ? "result-info-red" : "result-info-blue";
            return (
                <div key={index} className={`${Styles[classFollowKey]}`} data-testid="winning-info">
                    {translateMapping[keyName]}
                </div>
            );
        }
        return "";
    });
};

const ResultDetail = (resultDetail, t: TFunction, closeModal: () => void, gameName: string) => {
    if (resultDetail) {
        const { bet, roundId } = resultDetail;
        const { firstHalf, fullTime } = bet;
        const translateMapping = GetTranslateMapping(t, gameName);
        return (
            <ResultDetailContainer roundId={roundId} closeModal={closeModal} gameName={t(`${gameName}:${GameResourceKeys.GAME_NAME}`)}>
                <div className={Styles["result-details"]} data-testid="result-details">
                    {renderScoreRounds({
                        result: firstHalf?.result,
                        stateRound: StateRound.ht,
                        translateMapping,
                        total: firstHalf?.sum,
                        settlementResult: firstHalf?.settlementResult,
                    })}
                    {renderScoreRounds({
                        result: fullTime?.result,
                        stateRound: StateRound.ft,
                        translateMapping,
                        total: fullTime?.sum,
                        settlementResult: fullTime?.settlementResult,
                    })}
                </div>
            </ResultDetailContainer>
        );
    }
    return <></>;
};

export default ResultDetail;
