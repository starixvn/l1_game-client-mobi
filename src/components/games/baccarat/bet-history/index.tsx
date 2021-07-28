import { useTranslation, TFunction } from "next-i18next";
import React from "react";

import BetHistoryContainer, { FormatNumber, ResultDetailContainer } from "../../../dashboard/history/bet-history";
import { CardOrder, Odd } from "../baccarat";
import { BetLogs } from "./bet-history";
import Card from "../../../shared/card";
import Styles from "./bet-history.module.scss";
import BaseDialog from "../../../shared/base-dialog";
import { ModalType } from "../../../shared/base-dialog/type";
import { ResultDetail } from "../../../dashboard/history/bet-history/bet-history";

const renderResult = (bet: BetLogs, roundId: number, setIsShowResultDetail: Function, setResultDetail: Function, translate: TFunction) => {
    if (bet.result) {
        const clickHandle = () => {
            setIsShowResultDetail(true);
            setResultDetail({ bet: bet, roundId: roundId });
        };

        return (
            <div className={Styles["detail"]} onClick={() => clickHandle()}>
                {translate("details")}
            </div>
        );
    }
    return <></>;
};

const renderResultDetail = (resultDetail: ResultDetail, translate: TFunction, closeModal: () => void) => {
    if (resultDetail) {
        const { bet, roundId } = resultDetail;
        const result: any = bet?.result;
        const settlementResult: any = bet?.settlementResult;
        const playerCards = [
            { value: result?.player.card3, order: 5 },
            { value: result?.player.card2, order: 3 },
            { value: result?.player.card1, order: 1 },
        ];

        const bankerCards = [
            { value: result?.banker.card1, order: 2 },
            { value: result?.banker.card2, order: 4 },
            { value: result?.banker.card3, order: 6 },
        ];

        if (!result?.player.card3) {
            bankerCards[2].order = 5;
        }

        return (
            <BaseDialog type={ModalType.Center} isOpen={true} onCloseModal={closeModal} enableBackdrop={true}>
                <ResultDetailContainer translate={translate} roundId={roundId} closeModal={closeModal}>
                    <div className={Styles["result-detail"]}>
                        <div className={Styles["card-result-container"]}>
                            <div className={Styles["player-label"]}>{translate("player")}</div>
                            <div className={Styles["banker-label"]}>{translate("banker")}</div>
                            <div className={Styles["card-result"]}> {generateResultOnCard(playerCards)}</div>

                            <div className={Styles["card-result"]}> {generateResultOnCard(bankerCards)}</div>
                        </div>

                        <div className={Styles["winning-detail"]}>
                            {settlementResult?.banker ? translate("banker") : translate("player")} -{" "}
                            {settlementResult?.big ? translate("big") : translate("small")}
                        </div>
                    </div>
                </ResultDetailContainer>
            </BaseDialog>
        );
    }
    return <></>;
};

const generateResultOnCard = (cards: CardOrder[]) => {
    return cards.map((card) => {
        return (
            <div key={card.order} className="d-flex justify-content-center align-items-center">
                <div>{card.value && <Card result={card.value} isSmall={true}></Card>}</div>
            </div>
        );
    });
};

const renderBet = (bet: BetLogs, t: Function, mainOdds: object) => {
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
                                    {t(name)}@<FormatNumber>{odds[name] ? `${odds[name]}` : ""}</FormatNumber>
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

const BaccaratBetHistory: React.FunctionComponent<{ gameId: number; gameName: string }> = ({ gameId, gameName }) => {
    const { t } = useTranslation(gameName.toLowerCase());
    return (
        <BetHistoryContainer
            gameId={gameId}
            isRefund={false}
            renderResult={(
                bet: BetLogs,
                roundId: number,
                setIsShowResultDetail: Function,
                setResultDetail: Function,
                translate: TFunction
            ) => renderResult(bet, roundId, setIsShowResultDetail, setResultDetail, translate)}
            translate={t}
            renderBet={(bet: BetLogs, t: TFunction, mainOdds: Odd) => renderBet(bet, t, mainOdds)}
            renderResultDetail={(resultDetail: ResultDetail, translate: TFunction, closeModal: () => void) =>
                renderResultDetail(resultDetail, translate, closeModal)
            }
        ></BetHistoryContainer>
    );
};
export default BaccaratBetHistory;
