import React, { useEffect, useRef, useState } from "react";

import Styles from "./quick-bet-modal.module.scss";

const NumpadValues = [1, 5, 10, 50, 100, 200, 500, 1000];

export default function QuickBetModal() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [betStake, setBetStake] = useState<number>(1);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const toggle = (e: React.MouseEvent) => {
        debugger;
        e.stopPropagation();
        setDropdownOpen(!dropdownOpen);
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

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    return (
        <div className={Styles["game-menu"]}>
            <div className={`game-header-button ${Styles["quick-bet-info"]}`}>
                <div className={Styles["quick-bet-chip"]}>
                    <img src={"/static/images/icon-thunder.svg"} width={16} height={17} />
                </div>
            </div>
            <div className="dropdown" ref={wrapperRef}>
                <div className={`game-header-button dropdown-toggle ${Styles["dropdown-toggle"]}`} onClick={toggle}>
                    <span className={`icon-arrow-down ${Styles["icon-arrow-down"]}`}></span>
                </div>
                {dropdownOpen && (
                    <div className={`dropdown-menu ${Styles["dropdown-menu"]} show`}>
                        <span className={Styles["close-btn"]}></span>
                        <div className={Styles["title"]}>Quick Bet</div>
                        <div className={Styles["bet-settings"]}>
                            <div className={Styles["stake-settings"]}>
                                <label>Tiền cược sẵn</label>
                                <input type={"number"} onChange={(e) => handleInputBetStake(e)} value={betStake}></input>
                            </div>
                            <div className={Styles["quick-bet-settings"]}>
                                <label>Quick Bet</label>
                                <input type={"checkbox"}></input>
                            </div>
                            <div className={Styles["numpad"]}>
                                {NumpadValues.map((value) => (
                                    <span className={Styles["numpad"]} id={`numpad-${value}`} onClick={() => addBetStake(value)}>
                                        +{value}
                                    </span>
                                ))}
                            </div>
                            <div className={Styles["action"]}>
                                <button className={Styles["btn-reset"]} onClick={toggle}>
                                    Reset
                                </button>
                                <button className={Styles["btn-submit"]} onClick={toggle}>
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
