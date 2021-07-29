import { TFunction } from "next-i18next";
import React from "react";

import BetHistoryContainer, { FormatNumber, ResultDetailContainer } from "../../../dashboard/history/bet-history";
import { CardOrder, Odd } from "../baccarat";
import { BetLogs } from "./bet-history";
import Card from "../../../shared/card";
import { ResultDetail } from "../../../dashboard/history/bet-history/bet-history";
import { generateSettlementInfo } from "../animations";
import { GetPlayerCardsResult, GetBankerCardsResult, GetTranslateChoiceMapping } from "../baccarat-helper";
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

const renderResultDetail = (resultDetail: ResultDetail, t: TFunction, closeModal: () => void) => {
    if (resultDetail) {
        const { bet, roundId } = resultDetail;
        const result: any = bet?.result;
        const settlementResult: any = bet?.settlementResult;
        const translateChoiceMapping = GetTranslateChoiceMapping(t);

        return (
            <ResultDetailContainer translate={t} roundId={roundId} closeModal={closeModal}>
                <div className={Styles["card-result-container"]}>
                    <div className={Styles["player-label"]}>{t("player")}</div>
                    <div className={Styles["banker-label"]}>{t("banker")}</div>
                    <div className={Styles["card-result"]}> {generateResultOnCard(GetPlayerCardsResult(result))}</div>
                    <div className={Styles["card-result"]}>{generateResultOnCard(GetBankerCardsResult(result))}</div>
                </div>

                <div className={Styles["winning-detail"]}>{generateSettlementInfo(settlementResult, translateChoiceMapping)}</div>
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
            renderBet={(bet: BetLogs, t: TFunction, mainOdds: Odd, gameName) => renderBet(bet, t, mainOdds, gameName)}
            renderResultDetail={(resultDetail: ResultDetail, t: TFunction, closeModal: () => void) =>
                renderResultDetail(resultDetail, t, closeModal)
            }
        ></BetHistoryContainer>
    );
};
export default BaccaratBetHistory;
