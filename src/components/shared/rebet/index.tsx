import React, { useEffect, useState } from "react";
import { useGameContext } from "../../../contexts/game-context/game-context";
import { getLocalStorageItem, localStorageKeys } from "../../../common/local-storage";
import { RebetStorageModel } from "../game-base/type";
import styles from "./styles.module.scss";
import { BetState, BetTrackModel, Props } from "./type";

const Rebet: React.FC<Props> = (props) => {
    const gameContext = useGameContext();
    const rebetStorageKey = localStorageKeys.rebet;
    const rebetStorage = getLocalStorageItem<RebetStorageModel>(rebetStorageKey) || {};
    const rebetInfo = rebetStorage[props.gameId];
    const lastBetChoices = rebetInfo.betInfo;
    const { gameConfigs } = useGameContext();
    const { odds } = gameConfigs;

    const [betTrack, updateBetTrack] = useState<{ [key: string]: BetTrackModel }>({});
    const [isWaiting, updateIsWaiting] = useState(false);
    const [isSubmit, updateIsSummit] = useState(false);

    useEffect(
        () =>
            gameContext.handleMessage("endBet", (payload) => {
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
                  <div className={`${styles["bet-info"]} ${betTrack[betChoice] && styles[getClassByBetState(betTrack[betChoice].state)]}`}>
                      <div className={styles["bet-choice"]}>
                          {betChoice} {getOddsByChoice(betChoice)}
                      </div>
                      <div className={styles["bet-amount"]}>{lastBetChoices[betChoice]}</div>
                      {betTrack[betChoice]?.state === BetState.Error && (
                          <div className={styles["error-message"]}>{betTrack[betChoice].message}</div>
                      )}
                      {betTrack[betChoice] && <div className={styles["bet-state-icon"]}></div>}
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
            gameContext.placeBet(betChoice, lastBetChoices[betChoice]);
        });

        updateBetTrack(betTrack);
        updateIsSummit(true);
        updateIsWaiting(true);
    };

    const handleCloseModal = () => {
        props.onCloseModal();
    };

    return (
        <div className={styles["container"]}>
            <div className={styles["bet-list"]}>{renderLastRoundBet()}</div>
            <div className={`${styles["action"]} ${isWaiting && styles["waiting"]}`}>
                {!isSubmit && <button onClick={handleCloseModal}>Cancel</button>}
                {!isSubmit && <button onClick={handleSubmit}>Submit</button>}
                {isSubmit && <button onClick={handleCloseModal}>Ok</button>}
            </div>
        </div>
    );
};

export default Rebet;
