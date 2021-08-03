import { useTranslation } from "next-i18next";
import React, { useEffect, useRef, useState } from "react";
import { isMobileOnly } from "react-device-detect";
import NumberFormat from "react-number-format";

import { gameVipIds } from "../../../common/constants";
import { GameResourceKeys } from "../../../common/resources";
import { getSessionStorageItem, SessionStorageKeys } from "../../../common/session-storage";
import { useGameContext } from "../../../contexts/game-context/game-context";
import { numberWithCommas } from "../../../helpers/number-helper";
import { BetSettingStorage } from "../bet-settings/type";
import { numPad, tooltipTimeout } from "./place-bet-constant";
import { adjustPopupPosition, adjustPopupPositionDidUpdate, buildChips, buildVIPChips } from "./place-bet-modal-helper";
import { PlaceBetModalProps } from "./place-bet-modal-type";
import Styles from "./place-bet-modal.module.scss";

const betSettingStorageKey = SessionStorageKeys.betSetting;
let timeoutIns = null;

const PlaceBetModal: React.FC<PlaceBetModalProps> = (props) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const numberFormatRef = useRef<HTMLInputElement>(null);
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

    const maxBetPerRound = gameConfigs.maxbet;
    const maxBetChoice = gameConfigs.choices_maxbet?.[betChoice] ?? gameConfigs.maxbet;
    const chips = gameVipIds.includes(gameSetting.id) ? buildVIPChips(maxBetChoice) : buildChips(maxBetChoice);
    const payouts = [
        {
            text: t("common:payout"),
            value: numberWithCommas((betStake || 0) * odd),
        },
        {
            text: t("common:bettingLimits"),
            value: `${numberWithCommas(gameConfigs.minbet)} - ${numberWithCommas(Math.min(maxBetChoice, maxBetPerRound))}`,
        },
    ];
    
    const handleClickOutside = (event: any) => {
        console.log('handleClickOutside');

        if (props.isOpen && wrapperRef && wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            closeModal && closeModal();
        }
    };

    useEffect(() => {
        if (!isMobileOnly) {
            const popupStyle = adjustPopupPosition(props.gameBaseContainerRef, props.betOptionElement, props.betChoiceElement);
            setStyle(popupStyle.position);
            setAlignArrowStyle(popupStyle.alignArrowStyle);
            setArrowStyle(popupStyle.arrowStyle);
        }

        return () => {
            setTooltipMessage("");
            setBetStake(0);
            props.removeBetChoiceFocus();
        };
    }, []);

    useEffect(() => {
        window.addEventListener("mousedown", handleClickOutside);

        return () => {
            window.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    useEffect(() => {
        if (!isMobileOnly) {
            const popupStyle = adjustPopupPositionDidUpdate(
                props.gameBaseContainerRef,
                wrapperRef,
                props.betOptionElement,
                props.betChoiceElement
            );
            if (popupStyle.isAdjustPosition) {
                setStyle(popupStyle.position);
                setArrowStyle(popupStyle.arrowStyle);
            }
        }

        setTooltipContent();

        timeoutIns = setTimeout(() => {
            setShowTooltip(false);
        }, tooltipTimeout);

        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keyup", handleKeyUp);
            clearTimeout(timeoutIns);
        };
    }, [betStake]);

    const handleKeyUp = (event: any) => {
        if (event.keyCode === 13) {
            submitBet(event);
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
        setBetStake(isPlusValue && !Number.isNaN(betStake) ? betStake + stake : stake);
    };

    const clickNumpadHandler = (event: any, pad: any) => {
        pad.showValue
        ? setBetStake((!Number.isNaN(betStake) ? betStake : 0) * pad.powersOfTen + parseInt(pad.value))
        : deleteNumberHandler(event);
    };

    const deleteNumberHandler = (event: any) => {
        event.preventDefault();
        setBetStake((prevBetStake) => prevBetStake / 10);
    };

    const clearBetStake = () => {
        numberFormatRef.current.focus();
        setBetStake(null);
        setShowTooltip(false);
        setTooltipMessage("");
    };

    const onChangeStakeInputHandler = (value: string) => {
        setBetStake(parseInt(value));
        numberFormatRef.current.focus();
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
                        <div className="fake-input-pointer"></div>
                        <NumberFormat
                            getInputRef={numberFormatRef}
                            autoFocus
                            readOnly={isMobileOnly}
                            value={betStake ?? ""}
                            allowNegative={false}
                            className="form-control number"
                            thousandSeparator={true}
                            isNumericString={true}
                            defaultValue={""}
                            onValueChange={({ value }) => onChangeStakeInputHandler(value)}
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
                                <span className={Styles["value"]}>{chip.isPlusValue ? `+${chip.value}` : "MAX"}</span>
                            </div>
                        ))}
                    </div>

                    {isMobileOnly && (
                        <div className={Styles["numpad-container"]}>
                            {numPad.map((pad, index) => (
                                <div
                                    className={Styles["numpad"]}
                                    onClick={(event) => clickNumpadHandler(event, pad)}
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
            {!isMobileOnly && <div className={`${Styles["modal-arrow"]} ${Styles[arrowStyle]} ${Styles[alignArrowStyle]}`}></div>}
        </div>
    );
};

export default PlaceBetModal;
