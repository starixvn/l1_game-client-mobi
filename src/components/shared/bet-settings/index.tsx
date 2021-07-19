import React, { useEffect, useRef, useState } from "react";
import appSettings from "../../../common/app-settings";
import { getSessionStorageItem, SessionStorageKeys, storeSessionStorageItem } from "../../../common/session-storage";
import Styles from "./quick-bet-modal.module.scss";
import { BetSettingStorage } from "./type";

const NumpadValues = [1, 5, 10, 50, 100, 200, 500, 1000];
const betSettingStorageKey = SessionStorageKeys.betSetting;

export const BetSettings: React.FC<{ gameId?: number }> = ({ gameId }) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const betSettingStorage = getSessionStorageItem<BetSettingStorage>(betSettingStorageKey) ?? {};
    const betSetting = betSettingStorage[gameId ?? "global"];

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [betStake, setBetStake] = useState<number>(betSetting?.betStake ?? 1);
    const [enabledQuickBet, setEnabledQuickBet] = useState(betSetting?.enabledQuickBet);

    const toggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setDropdownOpen(!dropdownOpen);
    };

    const onClickReset = () => {
        setBetStake(1);
        setEnabledQuickBet(false);

        onSubmit();
    };

    const handleClickOutside = (event) => {
        if (wrapperRef && wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            setDropdownOpen(false);
        }
    };

    const handleInputBetStake = (event: React.ChangeEvent<HTMLInputElement>) => {
        setBetStake(+event.currentTarget.value);
    };

    const addBetStake = (amount: number) => {
        setBetStake(betStake + amount);
    };

    const onSubmit = () => {
        let currentBetSettingStorage = getSessionStorageItem<BetSettingStorage>(betSettingStorageKey) ?? {};

        if (gameId) {
            currentBetSettingStorage[gameId] = {
                enabledQuickBet,
                betStake,
            };
        } else {
            currentBetSettingStorage = appSettings.offeredGames.reduce((result, gameId) => {
                result[gameId] = { enabledQuickBet, betStake };

                return result;
            }, {});
            currentBetSettingStorage["global"] = { enabledQuickBet, betStake };
        }

        storeSessionStorageItem(betSettingStorageKey, currentBetSettingStorage);
        setDropdownOpen(false);
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    return (
        <div className={Styles["game-menu"]}>
            <div className={`game-header-button ${Styles["quick-bet-info"]}`}>
                <div className={`${Styles["quick-bet-chip"]} ${gameId ? Styles["global-setting"] : ""}`}>
                    <img src={"/static/images/icon-thunder.svg"} width={16} height={17} />
                    {enabledQuickBet && <span className={Styles["selected-bet-stake"]}>{betStake}</span>}
                </div>
                {/* Enable quick-bet */}
                {/* <img src={"/static/images/game-header-quick-bet-active.svg"} width={20} height={20} />
                    <span className={Styles["bet"]}>100</span> */}
            </div>
            <div className="dropdown" ref={wrapperRef}>
                <div className={`game-header-button dropdown-toggle ${Styles["dropdown-toggle"]}`} onClick={toggle}>
                    <span className={`icon-arrow-down ${Styles["icon-arrow-down"]}`}></span>
                </div>
                {dropdownOpen && (
                    <div className={`dropdown-menu ${Styles["quick-bet-form"]} show`}>
                        <div className={Styles["title"]}>Quick Bet</div>
                        <div className={Styles["bet-settings"]}>
                            <div className={Styles["stake-control"]}>
                                <label className={Styles["label"]}>Tiền cược sẵn</label>
                                <input
                                    className={`form-control ${Styles["stake"]}`}
                                    type={"number"}
                                    onChange={(e) => handleInputBetStake(e)}
                                    value={betStake}
                                ></input>
                                <span className={`icon-cancel ${Styles["icon-cancel"]}`}></span>
                            </div>

                            <div className={Styles["quick-bet-toggle"]}>
                                <label>Quick Bet</label>
                                <input
                                    className={Styles["toggle-checkbox"]}
                                    id="toggle-quickbet"
                                    type={"checkbox"}
                                    value={"Quick Bet"}
                                    checked={enabledQuickBet}
                                    onClick={() => setEnabledQuickBet(!enabledQuickBet)}
                                />
                                <label className={Styles["toggle-btn"]} htmlFor="toggle-quickbet">
                                    <div className={Styles["quick-bet-icon"]}></div>
                                </label>
                            </div>
                            <div className={Styles["numpad-container"]}>
                                {NumpadValues.map((value) => (
                                    <span className={Styles["numpad"]} id={`numpad-${value}`} onClick={() => addBetStake(value)}>
                                        +{value}
                                    </span>
                                ))}
                            </div>
                            <div className={Styles["actions"]}>
                                <button className="btn-grey" onClick={onClickReset}>
                                    Reset
                                </button>
                                <button className="btn-orange" onClick={onSubmit}>
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
