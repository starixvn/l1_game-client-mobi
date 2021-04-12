import React, { useEffect, useState } from "react";
import { useGameContext } from "../../../contexts/game-context/game-context";
import { getLocalStorageItem, localStorageKeys } from "../../../common/local-storage";
import { RebetStorageModel } from "../game-base/type";
import Styles from "./styles.module.scss";
import { BetState, BetTrackModel, Props } from "./type";
import { useGameActionContext } from "../../../contexts/game-actions-context";

const Rebet: React.FC<Props> = (props) => {
    const gameContext = useGameContext();
    const rebetStorageKey = localStorageKeys.rebet;
    const rebetStorage = getLocalStorageItem<RebetStorageModel>(rebetStorageKey) || {};
    const rebetInfo = rebetStorage[props.gameId];
    const lastBetChoices = rebetInfo.betInfo;
    const { gameConfigs } = useGameContext();
    const gameActionContext = useGameActionContext();
    const { odds } = gameConfigs;

    const [betTrack, updateBetTrack] = useState<{ [key: string]: BetTrackModel }>({});
    const [isWaiting, updateIsWaiting] = useState(false);
    const [isSubmit, updateIsSummit] = useState(false);

    useEffect(
        () =>
            gameActionContext.handleMessage("endBet", (payload) => {
                const { endBet, betChoice, notice } = payload;

                if (betTrack[betChoice]) {
                    betTrack[betChoice] = {
                        state: endBet > 0 ? BetState.Success : BetState.Error,
                        message: notice,
                    };

                    updateIsWaiting(checkBetFinish(betTrack));
                    updateBetTrack(betTrack);
                }
            }),
        []
    );

    const getOddsByChoice = (choice) => {
        return odds[choice] && `@1:${odds[choice]}`;
    };

    const checkBetFinish = (betTrack: { [key: string]: BetTrackModel }) =>
        !Object.values(betTrack).some((betTrackInfo) => betTrackInfo.state === BetState.Waiting);

    const renderLastRoundBet = () => {
        return lastBetChoices
            ? Object.keys(lastBetChoices).map((betChoice) => (
                  <div>
                      <div
                          className={`${Styles["bet-info"]} ${
                              betTrack[betChoice] && Styles[getClassByBetState(betTrack[betChoice].state)]
                          }`}
                      >
                          <div className={Styles["bet-choice"]}>
                              <span className={Styles["choice"]}>{betChoice}</span> {getOddsByChoice(betChoice)}
                          </div>
                          <div className="d-flex align-items-center">
                              <div className={Styles["bet-amount"]}>{lastBetChoices[betChoice]}</div>
                              {betTrack[betChoice] && (
                                  <div className={`icon-${getClassByBetState(betTrack[betChoice].state)} ${Styles["icon"]}`}></div>
                              )}
                          </div>
                      </div>
                      {betTrack[betChoice]?.state === BetState.Error && (
                          <div className={Styles["error-message"]}>{betTrack[betChoice].message}</div>
                      )}
                  </div>
              ))
            : null;
    };

    const getClassByBetState = (betState: BetState) => {
        return BetState[betState].toLocaleLowerCase();
    };

    const handleSubmit = () => {
        Object.keys(lastBetChoices).forEach((betChoice) => {
            betTrack[betChoice] = { state: BetState.Waiting };
            gameActionContext.placeBet(betChoice, lastBetChoices[betChoice]);
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
            <div className={Styles["bet-list"]}>{renderLastRoundBet()}</div>
            <div className={`${Styles["action"]} ${isWaiting && Styles["waiting"]}`}>
                {!isSubmit && (
                    <div className={Styles["button-group"]}>
                        <button onClick={handleCloseModal} className="btn-grey w-5">
                            Cancel
                        </button>
                        <button onClick={handleSubmit} className="btn-orange w-5">
                            Submit
                        </button>
                    </div>
                )}
                {isSubmit && (
                    <button onClick={handleCloseModal} className="btn-orange w-100">
                        Ok
                    </button>
                )}
            </div>
        </div>
    );
};

export default Rebet;
