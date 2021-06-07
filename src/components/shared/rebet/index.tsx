import React, { useEffect, useState } from "react";
import { useGameContext } from "../../../contexts/game-context/game-context";
import { getLocalStorageItem, localStorageKeys } from "../../../common/local-storage";
import { RebetStorageModel } from "../game-base/type";
import Styles from "./rebet.module.scss";
import { BetState, BetTrackModel, Props } from "./type";
import { useGameActionContext } from "../../../contexts/game-actions-context";
import { useTranslation, Trans } from "next-i18next";
import { GameResourceKeys } from "../../../common/resources/game-resource-keys";
import { numberWithCommas } from "../../../helpers/number-helper";
import { GetLocalizedErrorMessage } from "../../../helpers/notice-helper";

const Rebet: React.FC<Props> = (props) => {
    const rebetStorageKey = localStorageKeys.rebet;
    const rebetStorage = getLocalStorageItem<RebetStorageModel>(rebetStorageKey) || {};
    const rebetInfo = rebetStorage[props.gameId];
    const lastBetChoices = rebetInfo.betInfo;
    const { roundId, gameSetting } = useGameContext();
    const gameActionContext = useGameActionContext();
    const { gameName } = gameSetting;

    const { t } = useTranslation([gameName.toLowerCase(), "common", "messages"]);

    const [betTrack, updateBetTrack] = useState<{ [key: string]: BetTrackModel }>({});
    const [isWaiting, updateIsWaiting] = useState(false);
    const [isSubmit, updateIsSummit] = useState(false);

    useEffect(() => {
        const listenerId = gameActionContext.registerMessageHandler("endBet", handleEndBetMessage.bind(this));

        return () => gameActionContext.unsubscribeMessageHandler(listenerId);
    }, []);

    const handleEndBetMessage = ({ endBet, betChoice, notice, apiError }) => {
        if (betTrack[betChoice]) {
            console.log("handleEndBetMessage Rebet");
            betTrack[betChoice] = {
                state: endBet > 0 ? BetState.Success : BetState.Error,
                messages: {
                    gameName: t(`${gameName.toLowerCase()}:${GameResourceKeys.GAME_NAME}`),
                    roundId: notice?.gameRoundId || apiError?.gameRoundId,
                    message: GetLocalizedErrorMessage(notice?.errorCode || apiError?.errorCode),
                    errorCode: notice?.errorCode || apiError?.errorCode,
                    minBet: notice?.minBet || apiError?.minBet,
                    maxBet: notice?.maxBet || apiError?.maxBet,
                },
                validAmount: endBet > 0 ? endBet : 0,
            };

            if (checkBetFinish(betTrack)) {
                const totalSuccessBetAmount = Object.values(betTrack).reduce((total, bet) => total + bet.validAmount, 0);

                updateIsWaiting(false);
                gameActionContext.finishProcessingBet();
                totalSuccessBetAmount > 0 && gameActionContext.playAcceptedBetAnimation(totalSuccessBetAmount);
                !Object.values(betTrack).some((bet) => bet.state !== BetState.Success) && props.onCloseModal();
            }
            updateBetTrack(betTrack);
        }
    };

    const checkBetFinish = (betTrack: { [key: string]: BetTrackModel }) =>
        !Object.values(betTrack).some((betTrackInfo) => betTrackInfo.state === BetState.Waiting);

    const renderLastRoundBet = () => {
        return lastBetChoices
            ? Object.keys(lastBetChoices).map(
                  (betChoice) =>
                      lastBetChoices[betChoice] > 0 && (
                          <div key={betChoice}>
                              <div
                                  className={`${Styles["bet-info"]} ${
                                      betTrack[betChoice] && Styles[getClassByBetState(betTrack[betChoice].state)]
                                  }`}
                              >
                                  <div className={Styles["bet-choice"]}>
                                      <span className={Styles["choice"]}>{t(betChoice)}</span>
                                      {`@1:${props.getOddsByChoice(betChoice)}`}
                                  </div>
                                  <div className="d-flex align-items-center">
                                      <div className={Styles["bet-amount"]}>{numberWithCommas(lastBetChoices[betChoice])}</div>
                                      {betTrack[betChoice] && (
                                          <div className={`icon-${getClassByBetState(betTrack[betChoice].state)} ${Styles["icon"]}`}></div>
                                      )}
                                  </div>
                              </div>
                              {betTrack[betChoice]?.state === BetState.Error && (
                                  <div className={Styles["error-message"]}>
                                      <Trans t={t} components={{ br: <i /> }}>
                                          {t(betTrack[betChoice].messages.message, betTrack[betChoice].messages)}
                                      </Trans>
                                  </div>
                              )}
                          </div>
                      )
              )
            : null;
    };

    const getClassByBetState = (betState: BetState) => {
        return BetState[betState].toLocaleLowerCase();
    };

    const handleSubmit = () => {
        Object.keys(lastBetChoices).forEach((betChoice) => {
            if (lastBetChoices[betChoice] > 0) {
                betTrack[betChoice] = { state: BetState.Waiting };
                gameActionContext.placeBet(betChoice, lastBetChoices[betChoice]);
            }
        });

        updateBetTrack(betTrack);
        updateIsSummit(true);
        updateIsWaiting(true);
    };

    const handleCloseModal = () => {
        props.onCloseModal();
    };

    return (
        <div className={Styles["container"]}>
            <div className={Styles.header}>
                <div className={Styles["game-name"]}>{t(GameResourceKeys.GAME_NAME)}</div>
                <div className={Styles["round-number"]}>#{roundId}</div>
            </div>
            <div className={Styles["bet-list"]}>{renderLastRoundBet()}</div>
            <div className={`${Styles["action"]} ${isWaiting && Styles["waiting"]}`}>
                {!isSubmit && (
                    <div className={Styles["button-group"]}>
                        <button onClick={handleCloseModal} className="btn-grey w-5">
                            {t("common:cancel")}
                        </button>
                        <button onClick={handleSubmit} className="btn-orange w-5">
                            {t("common:confirm")}
                        </button>
                    </div>
                )}
                {isSubmit && (
                    <button onClick={handleCloseModal} className="btn-orange w-100">
                        {t("common:close")}
                    </button>
                )}
            </div>
        </div>
    );
};

export default Rebet;
