import { TFunction } from "next-i18next";
import React from "react";

import BetHistoryContainer, { FormatNumber, ResultDetailContainer } from "../../../dashboard/history/bet-history";
import { BetLogs } from "./bet-history";
import { ResultDetail } from "../../../dashboard/history/bet-history/bet-history";
import { generateSettlementInfo } from "../animations";
import { GetPlayerCardsResult, GetBankerCardsResult, GetTranslateChoiceMapping } from "../baccarat-helper";
import { GameResourceKeys } from "../../../../common/resources";
import { CardOrder, Odd } from "../baccarat";
import Card from "../../../shared/card";
import Styles from "./bet-history.module.scss";

const renderResult = (bet: BetLogs, roundId: number, setIsShowResultDetail: Function, setResultDetail: Function, t: TFunction) => {
    if (bet.result) {
        const clickHandle = () => {
            setIsShowResultDetail(true);
            setResultDetail({ bet: bet, roundId: roundId });
        };

        return (
            <div className={Styles["details"]} onClick={() => clickHandle()}>
                {t("details")}
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
                    <div className={Styles["player-label"]}>{t(`${gameName}:player`)}</div>
                    <div className={Styles["banker-label"]}>{t(`${gameName}:banker`)}</div>
                    <div
                        className={`${Styles["player"]} ${Styles["card-result"]} ${
                            Styles[getClassCardLength(GetPlayerCardsResult, result)]
                        }`}
                    >
                        {generateResultOnCard(GetPlayerCardsResult(result))}
                        {generateScore(GetPlayerCardsResult(result))}
                    </div>
                    <div
                        className={`${Styles["banker"]} ${Styles["card-result"]} ${
                            Styles[getClassCardLength(GetBankerCardsResult, result)]
                        }`}
                    >
                        {generateResultOnCard(GetBankerCardsResult(result))}
                        {generateScore(GetBankerCardsResult(result))}
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
                {card.value && <Card result={card.value}></Card>}
            </div>
        );
    });
};

const generateScore = (cards: CardOrder[]) => {
    const classGroupCards = `group-${cards.length}-cards`;
    const point = cards.reduce((total, c) => {
        return c.value.card + 1 >= 10 ? total : (total + c.value.card + 1) % 10;
    }, 0);

    return <div className={`${Styles[classGroupCards]} ${Styles["score"]}`}>{point}</div>;
};

const renderBet = (bet: BetLogs, t: Function, mainOdds: object, gameName: string) => {
    if (bet.settlementResult) {
        const keysChoices = Object.keys(bet.settlementResult);
        const odds = bet.odds ? bet.odds : mainOdds;
        return (
            <div className={Styles["list-choice"]}>
                {keysChoices &&
                    keysChoices.map((name, index) => {
                        const classHighLight = bet.settlementResult[name] ? "font-weight-medium" : "";
                        if (bet[name] > 0) {
                            return (
                                <div key={index} className={classHighLight}>
                                    {t(`${gameName}:${name}`)}@<FormatNumber>{odds[name] ? `${odds[name]}` : ""}</FormatNumber>
                                </div>
                            );
                        }
                        return "";
                    })}
            </div>
        );
    }

    return <></>;
};

const BaccaratBetHistory: React.FunctionComponent<{ gameId: number }> = ({ gameId }) => {
    return (
        <BetHistoryContainer
            gameId={gameId}
            isRefund={false}
            renderResult={(bet: BetLogs, roundId: number, setIsShowResultDetail: Function, setResultDetail: Function, t: TFunction) =>
                renderResult(bet, roundId, setIsShowResultDetail, setResultDetail, t)
            }
            renderBet={(bet: BetLogs, t: TFunction, mainOdds: Odd, gameName: string) => renderBet(bet, t, mainOdds, gameName)}
            renderResultDetail={(resultDetail: ResultDetail, t: TFunction, closeModal: () => void, gameName: string) =>
                renderResultDetail(resultDetail, t, closeModal, gameName)
            }
        ></BetHistoryContainer>
    );
};
export default BaccaratBetHistory;
