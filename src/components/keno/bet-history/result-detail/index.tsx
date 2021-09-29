import { TFunction } from "next-i18next";
import React from "react";

import ResultDetailContainer from "../../../dashboard/history/bet-history/result-detail";
import { GameResourceKeys } from "../../../../common/resources";
import { KenoMatchId, GetTranslateMapping } from "../../keno.helper";
import RenderScoreDetailKenoMatch from "../../../games/keno-match/bet-history/result-detail";
import RenderScoreDetailKenoPower from "../../../games/keno-power/bet-history/result-detail";
import Styles from "../bet-history.module.scss";

export const renderTeamWinningInfo = ({ settlementResult, translateMapping, choices, choiceForClassBlue }) => {
    return Object.keys(settlementResult).map((keyName, index) => {
        if (settlementResult[keyName] && choices.includes(keyName)) {
            const classFollowKey = choiceForClassBlue.includes(keyName) ? "result-info-blue" : "result-info-red";
            return (
                <div key={index} className={`${Styles[classFollowKey]}`} data-testid="team-winning-info">
                    {translateMapping[keyName]}
                </div>
            );
        }
        return "";
    });
};

const ResultDetail = (resultDetail, t: TFunction, closeModal: () => void, gameName: string, gameId: number) => {
    if (resultDetail) {
        const renderScoreDetail = KenoMatchId.includes(gameId) ? RenderScoreDetailKenoMatch : RenderScoreDetailKenoPower;
        const { bet, roundId } = resultDetail;
        const translateMapping = GetTranslateMapping(t, gameName);
        return (
            <ResultDetailContainer roundId={roundId} closeModal={closeModal} gameName={t(`${gameName}:${GameResourceKeys.GAME_NAME}`)}>
                <div className={Styles["result-details"]} data-testid="result-details">
                    {renderScoreDetail({ bet, translateMapping })}
                </div>
            </ResultDetailContainer>
        );
    }
    return <></>;
};

export default ResultDetail;
