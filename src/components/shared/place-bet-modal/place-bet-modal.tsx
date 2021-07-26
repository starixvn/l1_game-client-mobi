import { useTranslation } from "next-i18next";
import React, { useState, useEffect } from "react";

import { GameResourceKeys } from "../../../common/resources";
import { useGameContext } from "../../../contexts/game-context/game-context";
import { getSessionStorageItem, SessionStorageKeys } from "../../../common/session-storage";
import { BetSettingStorage } from "../bet-settings/type";
import { numberWithCommas } from "../../../helpers/number-helper";
import BaseDialog from "../base-dialog";
import { isMobile } from "react-device-detect";
import { ModalType } from "../base-dialog/type";
import { numPad } from "./place-bet-constant";
import { EventPosition } from "../game-base/type";
import NumberFormat from "react-number-format";
import Styles from "./place-bet-modal.module.scss";
import { useSystemContext } from "../../../contexts/system";

type BetChoiceInfo = {
    gameName: string;
    roundId: number;
    betChoice: string;
    odd: number;
};

type Props = {
    isOpen: boolean;
    onPlaceBet: (betChoice: string, amount: number) => void;
    betChoiceInfo: BetChoiceInfo;
    onCloseModal: Function;
    eventPosition?: EventPosition;
    betContainerPosition? : any,
    gameBaseContainerRef?: any,
    gameHeaderRef?: any,
};

const betSettingStorageKey = SessionStorageKeys.betSetting;
const tooltipTimeout = 3000;
let timeoutIns = null;

const PlaceBetModal: React.FC<Props> = (props) => {
    const { userStakeLevel } = useSystemContext();
    const { roundId, gameSetting, gameConfigs } = useGameContext();
    const betSettingStorage = getSessionStorageItem<BetSettingStorage>(betSettingStorageKey) ?? {};
    const { minbet } = gameConfigs;
    const { t } = useTranslation([gameSetting.gameName.toLocaleLowerCase(), "common"]);
    const { betChoice, odd } = props.betChoiceInfo;
    const [betStake, setBetStake] = useState(betSettingStorage[gameSetting.id]?.betStake ?? minbet);

    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipMessage, setTooltipMessage] = useState("");
    const title = t(GameResourceKeys.GAME_NAME);
    const subTitle = `#${roundId}`;

    const maxBetPerRound = Math.min(gameConfigs.maxbet, userStakeLevel.maxBet);
    let maxBetChoice = gameConfigs.choices_maxbet?.[betChoice] ?? gameConfigs.maxbet;

    const chips = [
        {
            style: "chip-1",
            value: 1,
        },
        {
            style: "chip-3",
            value: 10,
        },
        {
            style: "chip-6",
            value: 100,
        },
        {
            style: "chip-8",
            value: 500,
        },
        {
            style: "chip-13",
            value: maxBetChoice,
        },
    ];

    const payouts = [
        {
            text: t("common:payout"),
            value: numberWithCommas(betStake * odd),
        },
        {
            text: t("common:bettingLimits"),
            value: `${numberWithCommas(gameConfigs.minbet)} - ${numberWithCommas(maxBetChoice)}`,
        },
    ];

    const handleKeyUp = (event: any) => {
        if (event.keyCode === 13) {
            submitBet(event);
        }
    };

    useEffect(() => {
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    useEffect(() => {
        if (betStake > maxBetPerRound) {
            setShowTooltip(true);
            setTooltipMessage(t("messages:maxBetForChoiceNotice", { maxBet: maxBetPerRound }));
            setBetStake(maxBetPerRound);
            return;
        }

        if (betStake > maxBetChoice) {
            setShowTooltip(true);
            setTooltipMessage(t("messages:maxBetForChoiceNotice", { maxBet: maxBetChoice }));
            setBetStake(maxBetChoice);
            return;
        }

        setTimeout(() => {
            timeoutIns = setShowTooltip(false);
        }, tooltipTimeout);

        return () => {
            clearTimeout(timeoutIns);
        };
    }, [betStake]);

    const closeModal = () => {
        props.onCloseModal();
    };

    const addStakeHandler = (event: any, stake: number) => {
        event.preventDefault();
        setBetStake(betStake + stake);
    };

    const convertToIntFromNumpad = (numpadValue: string, inputValue: number, powersOfTen: number) =>
        inputValue * powersOfTen + parseInt(numpadValue);

    const deleteNumberHandler = (event: any) => {
        event.preventDefault();
        setBetStake((prevBetStake) => prevBetStake / 10);
    };

    const clearBetStake = (event: any) => {
        event.preventDefault();
        setBetStake(0);
    };

    const submitBet = (event: any) => {
        event.preventDefault();

        if (betStake < minbet) {
            setBetStake(minbet);
            setShowTooltip(true);
            setTooltipMessage(t("messages:minBetNotice", { minBet: minbet }));
            return;
        }

        closeModal();
        props.onPlaceBet(props.betChoiceInfo.betChoice, betStake);
    };

    return (
        <BaseDialog 
        betContainerPosition={props.betContainerPosition} 
        isOpen={props.isOpen}
         onCloseModal={closeModal} 
         type={ModalType.PlaceBetForm} 
         eventPosition={props.eventPosition}
         gameBaseContainerRef={props.gameBaseContainerRef}
         gameHeaderRef={props.gameHeaderRef}
         isPlaceBetPopup={true}
         >
            <div className={`${Styles.modal}`}>
                <div className={Styles["popup-closed-icon"]} onClick={() => closeModal()}>
                    <span className={`icon-close {Styles["icon-close"]}`}></span>
                </div>

                {title && (
                    <div className={Styles["popup-header"]}>
                        <h1 className={Styles["popup-title"]}>{t(title)}</h1>
                        {subTitle && <p className={Styles["popup-sub-title"]}>{t(subTitle)}</p>}
                    </div>
                )}
                <div
                    className={`${Styles["popup-content"]} ${subTitle ? Styles["has-subtitle"] : ""} ${
                        !title ? Styles["has-empty-title"] : ""
                    }`}
                >
                    <div className={Styles["place-bet-container"]}>
                        <div className={`w-100 ${Styles["general-info"]}`}>
                            <div className={Styles["bet-option"]}>{t(betChoice)}</div>
                            <div className={Styles["odds"]}>1:{odd}</div>
                        </div>

                        <div className={`form-group ${Styles["stake"]}`}>
                            <NumberFormat
                                readOnly={isMobile}
                                value={betStake}
                                allowNegative={false}
                                className="form-control number"
                                thousandSeparator={true}
                                isNumericString={true}
                                onValueChange={({ value }) => setBetStake(parseInt(value || "0"))}
                            />

                            <span className="icon-close small" onClick={clearBetStake}></span>
                            {showTooltip && (
                                <div className={`tooltip info show ${Styles["tooltip-info"]}`}>
                                    <div className={`tooltip-inner ${Styles["tooltip-inner"]}`}>{tooltipMessage}</div>
                                    <div className={`arrow up ${Styles["arrow"]}`}></div>
                                </div>
                            )}
                        </div>

                        {payouts.map((payout, index) => (
                            <div className={Styles["payout"]} key={index}>
                                <label>{payout.text}:</label>
                                <span className={Styles["highlight"]}>{payout.value}</span>
                            </div>
                        ))}

                        <div className={Styles["bet-chips"]}>
                            {chips.map((chip, index) => (
                                <div
                                    className={`${Styles["chip-container"]} ${Styles[chip.style]}`}
                                    key={index}
                                    onClick={(event) => addStakeHandler(event, chip.value)}
                                >
                                    <img
                                src={`/static/images/chips/${chip.style}.svg?v=2`}
                                        className={`img-fluid ${Styles["chip"]}`}
                                        width="48"
                                        height="50"
                                        alt="Chip"
                                    />
                                    <span className={Styles["value"]}>{chip.value == maxBetChoice ? "MAX" : `+${chip.value}`}</span>
                                </div>
                            ))}
                        </div>

                        {isMobile && (
                            <div className={Styles["numpad-container"]}>
                                {numPad.map((pad, index) => (
                                    <div
                                        className={Styles["numpad"]}
                                        onClick={(event) =>
                                            pad.showValue
                                                ? setBetStake(convertToIntFromNumpad(pad.value, betStake, pad.powersOfTen))
                                                : deleteNumberHandler(event)
                                        }
                                        key={index}
                                    >
                                        {pad.showValue ? pad.value : <span className="icon-delete"></span>}
                                    </div>
                                ))}
                            </div>
                        )}

                        <button onClick={submitBet} className={`btn-orange w-100 ${Styles["custom-button"]}`}>
                            {t("common:confirm")}
                        </button>
                    </div>
                </div>
            </div>
        </BaseDialog>
    );
};

export default PlaceBetModal;
