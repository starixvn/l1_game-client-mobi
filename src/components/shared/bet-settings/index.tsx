import { useTranslation } from "next-i18next";
import React, { useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import { isNumber, numberWithCommas } from "../../../helpers/number-helper";
import { GameConfigs } from "../game-base/type";
import Styles from "./quick-bet-modal.module.scss";
import { BetSetting } from "./type";

const NumpadValues = [1, 5, 10, 50, 100, 200, 500, 1000];

const BetSettings: React.FC<{ gameId?: number; updateBetSetting: Function; betSettings: BetSetting; gameConfigs?: GameConfigs }> = (
    props
) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [betStake, setBetStake] = useState<number>(props.betSettings?.betStake ?? 0);
    const [enabledQuickBet, setEnabledQuickBet] = useState(props.betSettings?.enabledQuickBet);
    const [showBetStakeTooltip, setShowBetStakeTooltip] = useState(false);
    const [showQuickBetTooltip, setShowQuickBetTooltip] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const { t } = useTranslation();
    const dropdownPosition = !props.gameId && isMobile ? "left" : "right";

    const toggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setDropdownOpen(!dropdownOpen);
    };

    const onClickReset = (e: React.MouseEvent) => {
        e.stopPropagation();
        props.updateBetSetting({ betStake: 0, enabledQuickBet: false }, props.gameId);
        setDropdownOpen(false);
    };

    const handleClickOutside = (event) => {
        if (wrapperRef && wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            setDropdownOpen(false);
        }

        setErrorMessage("");
        setShowBetStakeTooltip(false);
        setShowQuickBetTooltip(false);
    };

    const handleInputBetStake = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.currentTarget.value.replace(",", "");
        value === "" && setBetStake(0);
        isNumber(value) && setBetStake(+value);
    };

    const addBetStake = (event: React.MouseEvent, amount: number) => {
        event.stopPropagation();
        setBetStake(betStake + amount);
    };

    const onSubmit = (e: React.MouseEvent) => {
        e.stopPropagation();
        const validationCriteria = [
            { failure: !betStake, message: t("emptyPresetStakeMsg") },
            {
                failure: props.gameConfigs && betStake > props.gameConfigs.maxbet,
                message: t("messages:gameMaxBet", { maxBet: props.gameConfigs?.maxbet }),
            },
            {
                failure: props.gameConfigs && betStake < props.gameConfigs.minbet,
                message: t("messages:gameMinBet", { minBet: props.gameConfigs?.minbet }),
            },
        ];
        const failureCase = validationCriteria.find((criteria) => criteria.failure);

        if (failureCase) {
            setErrorMessage(failureCase.message);
        } else {
            props.updateBetSetting({ betStake, enabledQuickBet }, props.gameId);
            setDropdownOpen(false);
        }
    };

    const onClickChip = (e: React.MouseEvent) => {
        e.stopPropagation();
        props.updateBetSetting({ betStake, enabledQuickBet: !enabledQuickBet }, props.gameId);
    };

    const onDeleteStake = (e: React.MouseEvent) => {
        e.stopPropagation();
        setBetStake(0);
    };

    const toggleQuickBet = () => {
        setEnabledQuickBet(!enabledQuickBet);
    };

    const handlePresetStakeHintClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowBetStakeTooltip(true);
    };

    const handleQuickBetHintClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowQuickBetTooltip(true);
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    useEffect(() => {
        setBetStake(props.betSettings?.betStake ?? 0);
        setEnabledQuickBet(props.betSettings?.enabledQuickBet);
    }, [props.betSettings]);

    return (
        <div className={Styles["game-menu"]}>
            {props.gameId && (
                <div className={`game-header-button ${Styles["quick-bet-info"]}`}>
                    {enabledQuickBet ? (
                        <div className={Styles["quick-bet-active"]} onClick={onClickChip}>
                            <img src={"/static/images/game-header-quick-bet-active.svg"} width={20} height={20} />
                            <span className={Styles["selected-bet-stake"]}>{betStake}</span>
                        </div>
                    ) : (
                        <div className={`${Styles["quick-bet-chip"]}`} onClick={onClickChip}>
                            <img src={"/static/images/icon-thunder.svg?v=2"} width={17} height={16} />
                        </div>
                    )}
                </div>
            )}

            <div className="dropdown" ref={wrapperRef}>
                {props.gameId ? (
                    <div className={`dropdown-toggle game-header-button ${Styles["game-header-button"]}`} onClick={toggle}>
                        <span className={`icon-arrow-down ${Styles["icon-arrow-down"]}`}></span>
                    </div>
                ) : (
                    <div className={`dropdown-toggle header-button ${Styles["header-button"]}`} onClick={toggle}>
                        <div className={`${Styles["quick-bet-chip"]}`}>
                            {enabledQuickBet && (
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
                )}

                {dropdownOpen && (
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
                                        readOnly={isMobile}
                                    ></input>
                                    {errorMessage && (
                                        <div className={`tooltip info show ${Styles["error-info"]}`}>
                                            <div className={`arrow down ${Styles["arrow"]}`}></div>
                                            <div className={`tooltip-inner ${Styles["error-inner"]}`}>{errorMessage}</div>
                                        </div>
                                    )}
                                    <span className={`icon-close small ${Styles["icon-cancel"]}`} onClick={onDeleteStake}></span>
                                    <div className={`icon-help ${Styles["icon-help"]}`} onClick={handlePresetStakeHintClick}>
                                        {showBetStakeTooltip && (
                                            <div className={`tooltip info show`}>
                                                <div className={`tooltip-inner ${Styles["tooltip-inner"]}`}>{t("presetStakeTooltip")}</div>
                                                <div className={`arrow up ${Styles["tooltip-arrow"]}`}></div>
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
                                <div className={`icon-help ${Styles["icon-help"]}`} onClick={handleQuickBetHintClick}>
                                    {showQuickBetTooltip && (
                                        <div className={`tooltip info show`}>
                                            <div className={`tooltip-inner ${Styles["tooltip-inner"]}`}>{t("quickBetTooltip")}</div>
                                            <div className={`arrow up ${Styles["tooltip-arrow"]}`}></div>
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
                                <button className={`btn-orange ${Styles["custom-button"]}`} onClick={onSubmit}>
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
