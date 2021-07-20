import { useTranslation } from "next-i18next";
import React, { useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import Styles from "./quick-bet-modal.module.scss";
import { BetSetting } from "./type";

const NumpadValues = [1, 5, 10, 50, 100, 200, 500, 1000];

const BetSettings: React.FC<{ gameId?: number; updateBetSetting: Function; betSettings: BetSetting }> = (props) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [betStake, setBetStake] = useState<number>(props.betSettings?.betStake ?? 1);
    const [enabledQuickBet, setEnabledQuickBet] = useState(props.betSettings?.enabledQuickBet);
    const [showBetStakeTooltip, setShowBetStakeTooltip] = useState(false);
    const [showQuickBetTooltip, setShowQuickBetTooltip] = useState(false);
    const { t } = useTranslation();
    const dropdownPosition = !props.gameId && isMobile ? "left" : "right";

    const toggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setDropdownOpen(!dropdownOpen);
    };

    const onClickReset = () => {
        props.updateBetSetting({ betStake: 1, enabledQuickBet: false }, props.gameId);
        setDropdownOpen(false);
    };

    const handleClickOutside = (event) => {
        if (wrapperRef && wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            setDropdownOpen(false);
        }

        setShowBetStakeTooltip(false);
        setShowQuickBetTooltip(false);
    };

    const handleInputBetStake = (event: React.ChangeEvent<HTMLInputElement>) => {
        setBetStake(+event.currentTarget.value);
    };

    const addBetStake = (amount: number) => {
        setBetStake(betStake + amount);
    };

    const onSubmit = () => {
        props.updateBetSetting({ betStake, enabledQuickBet }, props.gameId);
        setDropdownOpen(false);
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    useEffect(() => {
        setBetStake(props.betSettings?.betStake ?? 1);
        setEnabledQuickBet(props.betSettings?.enabledQuickBet);
    }, [props.betSettings]);

    return (
        <div className={Styles["game-menu"]}>
            {props.gameId && (
                <div className={`game-header-button ${Styles["quick-bet-info"]}`}>
                    {enabledQuickBet ? (
                        <div className={Styles["quick-bet-active"]} onClick={toggle}>
                            <img src={"/static/images/game-header-quick-bet-active.svg"} width={20} height={20} />
                            <span className={Styles["selected-bet-stake"]}>{betStake}</span>
                        </div>
                    ) : (
                        <div className={`${Styles["quick-bet-chip"]}`} onClick={toggle}>
                            <img src={"/static/images/icon-thunder.svg"} width={16} height={17} />
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
                                <img src={"/static/images/chip-dollar-icon.svg"} className={Styles["icon-dollar"]} width={5} height={9} />
                            )}
                        </div>
                        <span className={Styles["quick-bet-text"]}>Quick bet</span>
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
                                        className={`form-control ${Styles["stake"]}`}
                                        type={"number"}
                                        onChange={(e) => handleInputBetStake(e)}
                                        value={betStake}
                                        readOnly={isMobile}
                                    ></input>
                                    <span className={`icon-cancel ${Styles["icon-cancel"]}`} onClick={() => setBetStake(1)}></span>
                                    <span
                                        className={`icon-help ${Styles["icon-help"]}`}
                                        onClick={() => setShowBetStakeTooltip(true)}
                                    ></span>
                                    {showBetStakeTooltip && <div className={Styles["tooltip"]}>{t("presetStakeTooltip")}</div>}
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
                                        onChange={() => setEnabledQuickBet(!enabledQuickBet)}
                                    />
                                    <label className={Styles["toggle-btn"]} htmlFor="toggle-quickbet">
                                        <div className={Styles["quick-bet-icon"]}></div>
                                    </label>
                                </div>
                                <span className={`icon-help ${Styles["icon-help"]}`} onClick={() => setShowQuickBetTooltip(true)}></span>
                                {showQuickBetTooltip && <div className={Styles["tooltip"]}>{t("quickBetTooltip")}</div>}
                            </div>

                            <div className={Styles["numpad-container"]}>
                                {NumpadValues.map((value) => (
                                    <span className={Styles["numpad"]} key={`numpad-${value}`} onClick={() => addBetStake(value)}>
                                        +{value}
                                    </span>
                                ))}
                            </div>
                            <div className={Styles["actions"]}>
                                <button className="btn-grey" onClick={onClickReset}>
                                    {t("reset")}
                                </button>
                                <button className="btn-orange" onClick={onSubmit}>
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
