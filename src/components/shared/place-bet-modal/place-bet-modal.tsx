import { useTranslation } from "next-i18next";
import React, { useState, useEffect, useRef } from "react";

import { GameResourceKeys } from "../../../common/resources";
import { useGameContext } from "../../../contexts/game-context/game-context";
import { getSessionStorageItem, SessionStorageKeys } from "../../../common/session-storage";
import { BetSettingStorage } from "../bet-settings/type";
import { numberWithCommas } from "../../../helpers/number-helper";
import { isMobile } from "react-device-detect";
import { numPad, tooltipTimeout } from "./place-bet-constant";
import NumberFormat from "react-number-format";
import Styles from "./place-bet-modal.module.scss";
import { useSystemContext } from "../../../contexts/system";
import { PlaceBetModalProps } from "./place-bet-modal-type";
import { buildChips, ajustPopupPosition, ajustPopupPositionDidUpdate, buildVIPChips } from "./place-bet-modal-helper";
import { gameVipIds } from "../../../common/constants";

const betSettingStorageKey = SessionStorageKeys.betSetting;
let timeoutIns = null;

const PlaceBetModal: React.FC<PlaceBetModalProps> = (props) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const { userStakeLevel } = useSystemContext();
    const { roundId, gameSetting, gameConfigs } = useGameContext();
    const betSettingStorage = getSessionStorageItem<BetSettingStorage>(betSettingStorageKey) ?? {};
    const { minbet } = gameConfigs;
    const { t } = useTranslation([gameSetting.gameName.toLocaleLowerCase(), "common"]);
    const { betChoice, odd } = props.betChoiceInfo;
    const [betStake, setBetStake] = useState(betSettingStorage[gameSetting.id]?.betStake ?? null);

    const [style, setStyle] = useState(null);
    const [arrowStyle, setArrowStyle] = useState("");
    const [alignArrowStyle, setAlignArrowStyle] = useState("");

    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipMessage, setTooltipMessage] = useState("");
    const title = t(GameResourceKeys.GAME_NAME);
    const subTitle = `#${roundId}`;

    const maxBetPerRound = Math.min(gameConfigs.maxbet, userStakeLevel.maxBet);
    const maxBetChoice = gameConfigs.choices_maxbet?.[betChoice] ?? gameConfigs.maxbet;
    const chips = gameVipIds.includes(gameSetting.id) ? buildVIPChips(maxBetChoice) : buildChips(maxBetChoice);
    const payouts = [
        {
            text: t("common:payout"),
            value: numberWithCommas((betStake || 0) * odd),
        },
        {
            text: t("common:bettingLimits"),
            value: `${numberWithCommas(gameConfigs.minbet)} - ${numberWithCommas(maxBetChoice)}`,
        },
    ];

    useEffect(() => {
        if (!isMobile) {
            const popupStyle = ajustPopupPosition(props.gameBaseContainerRef, props.betOptionElement, props.betChoiceElement);
            setStyle(popupStyle.position);
            setAlignArrowStyle(popupStyle.alignArrowStyle);
            setArrowStyle(popupStyle.arrowStyle);
        }

        return () => {
            setShowTooltip(false);
            setTooltipMessage("");
            setBetStake(0);
            props.removeBetChoiceFocus();
        };
    }, []);

    useEffect(() => {
        if (!isMobile) {
            const popupStyle = ajustPopupPositionDidUpdate(props.gameBaseContainerRef, wrapperRef, props.betOptionElement, props.betChoiceElement);
            if (popupStyle.isAjustPosition) {
                setStyle(popupStyle.position);
                setArrowStyle(popupStyle.arrowStyle);
            }
        }

        setTooltipContent();

        setTimeout(() => {
            timeoutIns = setShowTooltip(false);
        }, tooltipTimeout);

        window.addEventListener("keyup", handleKeyUp);
        window.addEventListener("mousedown", handleClickOutside);

        return () => {
            window.removeEventListener("keyup", handleKeyUp);
            window.removeEventListener("mousedown", handleClickOutside);
            clearTimeout(timeoutIns);
        };
    }, [betStake]);

    const handleKeyUp = (event: any) => {
        if (event.keyCode === 13) {
            submitBet(event);
        }
    };

    const handleClickOutside = (event: any) => {
        if (props.isOpen && wrapperRef && wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            closeModal && closeModal();
        }
    };
    const setTooltipContent = () => {
        if (betStake > maxBetPerRound) {
            setShowTooltip(true);
            setTooltipMessage(t("messages:maxBetForChoiceNotice", { maxBet: numberWithCommas(maxBetPerRound) }));
            setBetStake(maxBetPerRound);
            return;
        }

        if (betStake > maxBetChoice) {
            setShowTooltip(true);
            setTooltipMessage(t("messages:maxBetForChoiceNotice", { maxBet: numberWithCommas(maxBetChoice) }));
            setBetStake(maxBetChoice);
            return;
        }
    };

    const closeModal = () => {
        props.onCloseModal();
    };

    const addStakeHandler = (event: any, stake: number, isPlusValue = true) => {
        event.preventDefault();
        isPlusValue && !Number.isNaN(betStake) ? setBetStake(betStake+ stake) : setBetStake(stake);
    };

    const convertToIntFromNumpad = (numpadValue: string, inputValue: number, powersOfTen: number) =>
        inputValue * powersOfTen + parseInt(numpadValue);

    const deleteNumberHandler = (event: any) => {
        event.preventDefault();
        setBetStake((prevBetStake) => prevBetStake / 10);
    };

    const clearBetStake = (event: any) => {
        event.preventDefault();
        setBetStake(null);
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
        <div style={style} ref={wrapperRef} className={Styles["modal-placebetform"]}>
            <div className={Styles["popup-closed-icon"]} onClick={() => closeModal()}>
                <span className={`icon-close {Styles["icon-close"]}`}></span>
            </div>

            {title && (
                <div className={Styles["popup-header"]}>
                    <h1 className={Styles["popup-title"]}>{t(title)}</h1>
                    {subTitle && <div className={Styles["popup-sub-title"]}>{t(subTitle)}</div>}
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
                            autoFocus
                            readOnly={isMobile}
                            value={betStake ?? ''}
                            allowNegative={false}
                            className="form-control number"
                            thousandSeparator={true}
                            isNumericString={true}
                            defaultValue={""}
                            onValueChange={({ value }) => setBetStake(parseInt(value))}
                        />

                        <span className="icon-close small" onClick={clearBetStake}></span>
                        {showTooltip && (
                            <div className={`tooltip info show ${Styles["tooltip-info"]}`}>
                                <div className={`tooltip-inner ${Styles["tooltip-inner"]}`}>
                                    {tooltipMessage}
                                    <div className={`arrow up ${Styles["arrow"]}`}></div>
                                </div>
                            </div>
                        )}
                    </div>

                    {payouts.map((payout, index) => (
                        <div className={Styles["payout"]} key={index}>
                            <label>{payout.text}</label>
                            <span className={Styles["number"]}>{payout.value}</span>
                        </div>
                    ))}

                    <div className={Styles["bet-chips"]}>
                        {chips.map((chip, index) => (
                            <div
                                className={`${Styles["chip-container"]} ${Styles[chip.style]}`}
                                key={index}
                                onClick={(event) => addStakeHandler(event, chip.value, chip.isPlusValue)}
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
                        {t("common:bet")}
                    </button>
                </div>
            </div>
            {!isMobile && <div className={`${Styles["modal-arrow"]} ${Styles[arrowStyle]} ${Styles[alignArrowStyle]}`}></div>}
        </div>
    );
};

export default PlaceBetModal;
