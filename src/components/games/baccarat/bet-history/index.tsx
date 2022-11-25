import { TFunction } from "next-i18next";
import React from "react";

import BetHistoryContainer from "../../../dashboard/history/bet-history";
import ResultDetailContainer from "../../../dashboard/history/bet-history/result-detail";
import { BetLogs } from "./bet-history";
import { ResultDetail } from "../../../dashboard/history/bet-history/bet-history";
import { generateSettlementInfo } from "../animations";
import { GetPlayerCardsResult, GetBankerCardsResult, GetTranslateChoiceMapping } from "../baccarat-helper";
import { GameResourceKeys } from "../../../../common/resources";
import { CardOrder } from "../baccarat";
import Card from "../../../shared/card";
import Styles from "./bet-history.module.scss";

const renderResult = (bet: BetLogs, roundId: number, setIsShowResultDetail: Function, setBetLog: Function, t: TFunction) => {
    if (bet.result) {
        const clickHandle = () => {
            setIsShowResultDetail(true);
            setBetLog({ bet: bet, roundId: roundId, t });
        };
        const result: any = bet?.result;

        return (
            <div className={Styles["details"]} onClick={() => clickHandle()}>
                {generateScore(GetPlayerCardsResult(result))} | {generateScore(GetBankerCardsResult(result))}
            </div>
        );
    }
    return <></>;
};

const renderResultDetail = (resultDetail: ResultDetail, t: TFunction, closeModal: () => void, gameName: string) => {
    if (resultDetail) {
        const { bet, roundId } = resultDetail;
        const result: any = bet?.result;
        const settlementResult: any = bet?.settlementResult;
        const getClassCardLength = (getCard: Function, result: any) => {
            return `card-length-${getCard(result).filter((c) => !!c.value).length}`;
        };

        return (
            <ResultDetailContainer roundId={roundId} closeModal={closeModal} gameName={t(`${gameName}:${GameResourceKeys.GAME_NAME}`)}>
                <div className={Styles["card-result-container"]}>
                    <div className={`${Styles["player-label"]} ${Styles[getClassCardLength(GetPlayerCardsResult, result)]}`}>
                        {t(`${gameName}:player`)}:{" "}
                        <span className={Styles["number-score"]}>{generateScore(GetPlayerCardsResult(result))}</span>
                    </div>
                    <div className={`${Styles["banker-label"]} ${Styles[getClassCardLength(GetBankerCardsResult, result)]}`}>
                        {t(`${gameName}:banker`)}:{" "}
                        <span className={Styles["number-score"]}>{generateScore(GetBankerCardsResult(result))}</span>
                    </div>
                    <div
                        className={`${Styles["player"]} ${Styles["card-result"]} ${
                            Styles[getClassCardLength(GetPlayerCardsResult, result)]
                        }`}
                    >
                        {generateResultOnCard(GetPlayerCardsResult(result))}
                    </div>
                    <div
                        className={`${Styles["banker"]} ${Styles["card-result"]} ${
                            Styles[getClassCardLength(GetBankerCardsResult, result)]
                        }`}
                    >
                        {generateResultOnCard(GetBankerCardsResult(result))}
                    </div>
                </div>

                <div className={Styles["winning-detail"]}>
                    {generateSettlementInfo(settlementResult, GetTranslateChoiceMapping(t, gameName), true)}
                </div>
            </ResultDetailContainer>
        );
    }
    return <></>;
};

const generateResultOnCard = (cards: CardOrder[]) => {
    return cards.map((card) => {
        return (
            <div key={card.order} className={Styles[`card${card.order}`]}>
                {card.value && <Card result={card.value} isSmall={true} customClassName={"baccarat-ticket-detail"}></Card>}
            </div>
        );
    });
};

const generateScore = (cards: CardOrder[]) => {
    return cards.reduce((total, c) => {
        return c.value.card + 1 >= 10 ? total : (total + c.value.card + 1) % 10;
    }, 0);
};

const BaccaratBetHistory: React.FunctionComponent<{ gameId: number; fractionalOddsFormat: boolean | undefined }> = ({
    gameId,
    fractionalOddsFormat,
}) => {
    return (
        <BetHistoryContainer
            gameId={gameId}
            isRefund={false}
            renderResult={(bet: BetLogs, roundId: number, setIsShowResultDetail: Function, setBetLog: Function, t: TFunction) =>
                renderResult(bet, roundId, setIsShowResultDetail, setBetLog, t)
            }
            renderResultDetail={(resultDetail: ResultDetail, t: TFunction, closeModal: () => void, gameName: string) =>
                renderResultDetail(resultDetail, t, closeModal, gameName)
            }
            fractionalOddsFormat={fractionalOddsFormat}
        ></BetHistoryContainer>
    );
};
export default BaccaratBetHistory;
