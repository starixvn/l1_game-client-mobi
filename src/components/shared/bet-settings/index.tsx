import { useTranslation } from "next-i18next";
import React, { useEffect, useRef, useState } from "react";
import { isMobile, isMobileOnly } from "react-device-detect";
import { getLocalStorageItem, localStorageKeys, storeLocalStorageItem } from "../../../common/local-storage";
import { getSessionStorageItem, SessionStorageKeys } from "../../../common/session-storage";
import { isNumber, numberWithCommas } from "../../../helpers/number-helper";
import { GameConfigs } from "../game-base/type";
import { Tooltip } from "../tooltip";
import Styles from "./quick-bet-modal.module.scss";
import { BetSetting, BetSettingStorage } from "./type";

const NumpadValues = [1, 5, 10, 50, 100, 200, 500, 1000];
const MaxInputValue = 99999;
const betSettingsStorageKey = SessionStorageKeys.betSetting;
const globalSettingHintKey = localStorageKeys.globalSettingHint;
const quickBetHintKey = localStorageKeys.quickBetHint;
let quickBetHintShowTimeOut: NodeJS.Timeout = null;

const BetSettings: React.FC<{
    gameId?: number;
    updateBetSetting: Function;
    betSettings: BetSetting;
    gameConfigs?: GameConfigs;
    isDisabled?: boolean;
}> = (props) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const arrowBtnRef = useRef<HTMLDivElement>(null);
    const betStakeTooltipRef = useRef<HTMLDivElement>(null);
    const quickBetTooltipRef = useRef<HTMLDivElement>(null);
    const quickBetHintRef = useRef<HTMLDivElement>(null);
    const inputStakeRef = useRef<HTMLInputElement>(null);
    const globalSettingHintRef = useRef<HTMLDivElement>(null);
    const quickBetBtnWrapperRef = useRef<HTMLDivElement>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [betStake, setBetStake] = useState<number>(props.betSettings?.betStake ?? 0);
    const [enabledQuickBet, setEnabledQuickBet] = useState(props.betSettings?.enabledQuickBet);
    const [showBetStakeTooltip, setShowBetStakeTooltip] = useState(false);
    const [showQuickBetTooltip, setShowQuickBetTooltip] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isShowGlobalSettingHint, setIsShowGlobalSettingHint] = useState(!getLocalStorageItem<boolean>(globalSettingHintKey));
    const [isShowQuickBetHint, setIsShowQuickBetHint] = useState(false);
    const { t } = useTranslation();
    const dropdownPosition = !props.gameId && isMobile ? "left" : "right";

    const updateSettings = (stake: number, enabled: boolean) => {
        props.updateBetSetting({ betStake: stake, enabledQuickBet: enabled }, props.gameId);

        setBetStake(stake);
        setEnabledQuickBet(enabled);

        if (props.gameId && enabled && !getLocalStorageItem<boolean>(quickBetHintKey)) {
            setIsShowQuickBetHint(true);
            storeLocalStorageItem(quickBetHintKey, true);
            quickBetHintShowTimeOut = setTimeout(() => {
                setIsShowQuickBetHint(false);
            }, 3000);
        }
    };

    const toggle = (e: React.MouseEvent) => {
        e.stopPropagation();

        dropdownOpen && onCloseSettingsModal();
        setDropdownOpen(!dropdownOpen);
    };

    const onClickReset = (e: React.MouseEvent) => {
        e.stopPropagation();
        updateSettings(0, false);
        setDropdownOpen(false);
    };

    const handleInputBetStake = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.currentTarget.value.replace(",", "");
        value === "" && setBetStake(0);
        isNumber(value) && +value <= MaxInputValue && setBetStake(+value);
        inputStakeRef.current.focus();
    };

    const addBetStake = (event: React.MouseEvent, amount: number) => {
        event.stopPropagation();
        const newBetStake = betStake + amount;

        newBetStake <= MaxInputValue && setBetStake(newBetStake);
        inputStakeRef.current.focus();
    };

    const handleSubmit = (e: React.MouseEvent) => {
        e.stopPropagation();
        const validationCriteria = [
            { failure: !betStake && !props.gameConfigs?.minbet, message: t("emptyPresetStakeMsg") },
            {
                failure: props.gameConfigs && betStake > props.gameConfigs.maxbet,
                message: t("messages:gameMaxBet", { maxBet: numberWithCommas(props.gameConfigs?.maxbet ?? 0) }),
                action: () => setBetStake(props.gameConfigs.maxbet),
            },
            {
                failure: props.gameConfigs && betStake < props.gameConfigs.minbet,
                message: t("messages:gameMinBet", { minBet: numberWithCommas(props.gameConfigs?.minbet ?? 0) }),
                action: () => setBetStake(props.gameConfigs.minbet),
            },
        ];
        const failureCase = validationCriteria.find((criteria) => criteria.failure);

        if (failureCase) {
            failureCase.action && failureCase.action();
            setErrorMessage(failureCase.message);
            inputStakeRef.current.focus();
        } else {
            updateSettings(betStake, enabledQuickBet);
            setDropdownOpen(false);
        }
    };

    const onClickChip = (e: React.MouseEvent) => {
        e.stopPropagation();
        const newBetStake = betStake || props.gameConfigs.minbet;

        updateSettings(newBetStake, !enabledQuickBet);
    };

    const onDeleteStake = (e: React.MouseEvent) => {
        e.stopPropagation();
        setBetStake(0);
        inputStakeRef.current.focus();
    };

    const toggleQuickBet = () => {
        setEnabledQuickBet(!enabledQuickBet);
    };

    const handlePresetStakeHintClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowBetStakeTooltip(!showBetStakeTooltip);
    };

    const handleQuickBetHintClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowQuickBetTooltip(!showQuickBetTooltip);
    };

    const stopPropagation = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    const onCloseSettingsModal = () => {
        const settings = getSessionStorageItem<BetSettingStorage>(betSettingsStorageKey) ?? {};
        const gameSettings = props.gameId ? settings[props.gameId] : settings["global"];
        setBetStake(gameSettings?.betStake ?? 0);
        setEnabledQuickBet(gameSettings?.enabledQuickBet);
    };

    const handleKeyDown = (event: any) => {
        if (event.keyCode === 13) {
            dropdownOpen && handleSubmit(event);
        }
    };

    const handleClickOutside = (event) => {
        if (wrapperRef && wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            setDropdownOpen(false);
            setShowQuickBetTooltip(false);
            setShowBetStakeTooltip(false);
            onCloseSettingsModal();
        }

        if (betStakeTooltipRef && betStakeTooltipRef.current && !betStakeTooltipRef.current.contains(event.target)) {
            setShowBetStakeTooltip(false);
        }

        if (quickBetTooltipRef && quickBetTooltipRef.current && !quickBetTooltipRef.current.contains(event.target)) {
            setShowQuickBetTooltip(false);
        }

        if (quickBetHintRef && quickBetHintRef.current && !quickBetHintRef.current.contains(event.target)) {
            setIsShowQuickBetHint(false);
        }

        if (globalSettingHintRef && globalSettingHintRef.current && !globalSettingHintRef.current.contains(event.target)) {
            setIsShowGlobalSettingHint(false);
        }
        setErrorMessage("");
    };

    const handleConfirmHint = () => {
        setIsShowGlobalSettingHint(false);
        storeLocalStorageItem(globalSettingHintKey, true);
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);

        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [dropdownOpen, betStake, enabledQuickBet]);

    useEffect(() => {
        setBetStake(props.betSettings?.betStake ?? 0);
        setEnabledQuickBet(props.betSettings?.enabledQuickBet);
    }, [props.betSettings?.betStake, props.betSettings?.enabledQuickBet]);

    useEffect(() => {
        return () => clearTimeout(quickBetHintShowTimeOut);
    }, []);

    return (
        <div className={Styles["game-menu"]} onClick={stopPropagation}>
            {props.gameId && (
                <>
                    <div className={`game-header-button ${Styles["quick-bet-info"]}`} onClick={onClickChip} ref={quickBetBtnWrapperRef}>
                        {enabledQuickBet ? (
                            <div className={Styles["quick-bet-active"]}>
                                <img
                                    className={Styles["chip-active"]}
                                    src={"/static/images/game-header-quick-bet-active.svg"}
                                    width={20}
                                    height={20}
                                />
                                <span className={Styles["selected-bet-stake"]}>{numberWithCommas(betStake)}</span>
                            </div>
                        ) : (
                            <div className={`${Styles["quick-bet-chip"]}`}>
                                <img src={"/static/images/icon-thunder.svg?v=2"} width={17} height={16} alt="icon-thunder" />
                            </div>
                        )}

                        <Tooltip
                            message={`${t("quickBet")} : ${enabledQuickBet ? t("on") : t("off")}`}
                            hoverWrapper={quickBetBtnWrapperRef}
                        />
                    </div>

                    {isShowQuickBetHint && (
                        <div ref={quickBetHintRef} className={`tooltip info show ${Styles["quick-bet-hint-wrapper"]}`}>
                            <div className={`tooltip-inner ${Styles["tooltip-inner"]}`}>
                                {t("quickBetHint")}
                                <div className={`arrow up ${Styles["arrow"]}`}></div>
                            </div>
                        </div>
                    )}
                </>
            )}

            <div className="dropdown" ref={wrapperRef}>
                {props.gameId ? (
                    <>
                        <div
                            className={`dropdown-toggle game-header-button ${Styles["game-header-button"]}`}
                            onClick={toggle}
                            ref={arrowBtnRef}
                        >
                            <span className={`icon-arrow-down ${Styles["icon-arrow-down"]}`}></span>
                            <Tooltip message={t("presetStake")} hoverWrapper={arrowBtnRef} />
                        </div>
                    </>
                ) : (
                    <>
                        <div className={`dropdown-toggle header-button ${Styles["header-button"]}`} onClick={toggle}>
                            <div className={`${Styles["quick-bet-chip"]}`}>
                                {(enabledQuickBet || !!betStake) && (
                                    <img
                                        src={"/static/images/chip-dollar-icon.svg?v=2"}
                                        className={Styles["icon-dollar"]}
                                        width={14}
                                        height={14}
                                    />
                                )}
                            </div>
                            <span className={Styles["quick-bet-text"]}>{t("quickBet")}</span>
                            <span className={`icon-arrow-down ${Styles["icon-arrow-down"]}`}></span>
                        </div>
                        {isShowGlobalSettingHint && (
                            <div ref={globalSettingHintRef} className={`tooltip info show ${Styles["global-setting-hint-wrapper"]}`}>
                                <div className={`tooltip-inner ${Styles["tooltip-inner"]}`}>
                                    {t("globalSettingHint")}
                                    <div className={`arrow up ${Styles["arrow"]}`}></div>
                                    <button onClick={handleConfirmHint} className={`btn-orange ${Styles["btn-confirm"]}`}>
                                        {t("common:globalSettingHintConfirm")}
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {dropdownOpen && !props.isDisabled && (
                    <div className={`dropdown-menu ${Styles["quick-bet-form"]} show ${dropdownPosition}`}>
                        <div className={Styles["title"]}>{t("quickBet")}</div>
                        <div className={Styles["bet-settings"]}>
                            <div className={Styles["stake-control"]}>
                                <label className={Styles["label"]}>{t("presetStake")}</label>
                                <div className={`form-group ${Styles["group-help"]}`}>
                                    <input
                                        className={`form-control number`}
                                        type={"text"}
                                        onChange={handleInputBetStake}
                                        value={numberWithCommas(betStake) !== "0" ? numberWithCommas(betStake) : ""}
                                        inputMode={"numeric"}
                                        readOnly={isMobileOnly}
                                        maxLength={6}
                                        ref={inputStakeRef}
                                        autoFocus
                                    ></input>
                                    {errorMessage && (
                                        <div className={`tooltip info show ${Styles["error-info"]}`}>
                                            <div className={`tooltip-inner ${Styles["error-inner"]}`}>
                                                {errorMessage}
                                                <div className={`arrow up ${Styles["arrow-stake"]}`}></div>
                                            </div>
                                        </div>
                                    )}
                                    <span className={`icon-close small ${Styles["icon-cancel"]}`} onClick={onDeleteStake}></span>
                                    <div
                                        ref={betStakeTooltipRef}
                                        className={`icon-help ${Styles["icon-help"]}`}
                                        onClick={handlePresetStakeHintClick}
                                    >
                                        {showBetStakeTooltip && (
                                            <div className={`tooltip info show`}>
                                                <div className={`tooltip-inner ${Styles["tooltip-inner-help"]}`}>
                                                    {t("presetStakeTooltip")}
                                                    <div className={`arrow down ${Styles["arrow-help"]}`}></div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className={`form-group ${Styles["group-help"]}`}>
                                <div className={Styles["quick-bet-toggle"]}>
                                    <label>{t("quickBet")}</label>
                                    <input
                                        className={Styles["toggle-checkbox"]}
                                        id="toggle-quickbet"
                                        type={"checkbox"}
                                        value={"Quick Bet"}
                                        checked={enabledQuickBet}
                                        onChange={toggleQuickBet}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    <label className={Styles["toggle-btn"]} htmlFor="toggle-quickbet">
                                        <div className={Styles["quick-bet-icon"]}></div>
                                    </label>
                                </div>
                                <div
                                    ref={quickBetTooltipRef}
                                    className={`icon-help ${Styles["icon-help"]}`}
                                    onClick={handleQuickBetHintClick}
                                >
                                    {showQuickBetTooltip && (
                                        <div className={`tooltip info show`}>
                                            <div className={`tooltip-inner ${Styles["tooltip-inner-help"]}`}>
                                                {t("quickBetTooltip")}
                                                <div className={`arrow down ${Styles["arrow-help"]}`}></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className={Styles["numpad-container"]}>
                                {NumpadValues.map((value) => (
                                    <span className={Styles["numpad"]} key={`numpad-${value}`} onClick={(e) => addBetStake(e, value)}>
                                        +{value}
                                    </span>
                                ))}
                            </div>
                            <div className={Styles["actions"]}>
                                <button className={`btn-grey ${Styles["custom-button"]}`} onClick={onClickReset}>
                                    {t("reset")}
                                </button>
                                <button className={`btn-orange ${Styles["custom-button"]}`} onClick={handleSubmit}>
                                    {t("save")}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default React.memo(BetSettings);
