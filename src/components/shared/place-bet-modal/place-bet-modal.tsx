import React, { ChangeEvent, Component } from "react";
import { InputGroupAddon, InputGroup, InputGroupText, Input } from "reactstrap";
import { GameContext, useGameContext } from "../../../contexts/game-context/game-context";

import Styles from "./place-bet-modal.module.scss";

type BetChoiceInfo = {
    gameName: string;
    roundId: number;
    betChoice: string;
    odds: number;
};

type Props = {
    isOpen: boolean;
    onPlaceBet: (betChoice: string, amount: number) => void;
    betChoiceInfo: BetChoiceInfo;
    onCloseModal: Function;
};

type State = {
    betAmount: number;
    payout: number;
};

export default class PlaceBetModal extends Component<Props, State> {
    static contextType = GameContext;
    wrapperRef: React.RefObject<HTMLDivElement>;
    commonKeyBoard: Array<string> = ["1", "2", "3", "4", "5", "del", "6", "7", "8", "9", "0", "00"];
    specialKeyBoard: Array<string> = ["+1", "+5", "+10", "+50", "+100", "+200", "+500", "MAX"];

    constructor(props: Props) {
        super(props);

        this.wrapperRef = React.createRef();

        this.state = {
            betAmount: 0,
            payout: 0,
        };

        this.closeModal = this.closeModal.bind(this);
    }

    componentDidMount() {
        document.addEventListener("mousedown", this.handleClickOutside);
    }

    componentWillUnmountMount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
    }

    handleClickOutside = (event) => {
        if (this.props.isOpen && this.wrapperRef && this.wrapperRef.current && !this.wrapperRef.current.contains(event.target)) {
            this.closeModal();
        }
    };

    closeModal() {
        this.props.onCloseModal();
    }

    handleInputBetAmount = (event) => {
        this.updateBetAmount(event.target.value);
    };

    placeBet = () => {
        this.props.onPlaceBet(this.props.betChoiceInfo.betChoice, this.state.betAmount);
        this.closeModal();
    };

    updateBetAmount = (betAmount: number) => {
        const { odds } = this.props.betChoiceInfo;
        const maxBet = this.getMaxBet();
        const amount = betAmount > maxBet ? maxBet : betAmount;
        const payout = amount * odds;

        this.setState({
            betAmount: amount,
            payout,
        });
    };

    getMaxBet = () => {
        const { betChoice } = this.props.betChoiceInfo;
        const { gameConfigs } = this.context;
        const { maxbet, choices_maxbet } = gameConfigs;

        return maxbet > choices_maxbet[betChoice] ? maxbet : choices_maxbet[betChoice];
    };

    handlePressSpecificKeyBoard = (action: string) => {
        const { betAmount } = this.state;

        switch (action) {
            case "del":
                this.updateBetAmount(Math.floor(betAmount / 10));
                break;
            case "MAX":
                this.updateBetAmount(this.getMaxBet());
                break;
        }
    };

    handlePressKeyBoard = (action: string, itemKey: string) => {
        const { betAmount } = this.state;
        const amount = +itemKey;

        if (action === "add") {
            this.updateBetAmount(betAmount + amount);
        }

        if (action === "push") {
            this.updateBetAmount(betAmount * 10 ** itemKey.length + amount);
        }
    };

    renderKeyBoard = (keyBoard: Array<string>, action: string) =>
        keyBoard.map((key, index) => {
            switch (key) {
                case "del":
                    return (
                        <div key={`key-board-${index}`} className={Styles["item"]} onClick={() => this.handlePressSpecificKeyBoard(key)}>
                            <span className="icon-remove"></span>
                        </div>
                    );
                case "MAX":
                    return (
                        <div key={`key-board-${index}`} className={Styles["item"]} onClick={() => this.handlePressSpecificKeyBoard(key)}>
                            {key}
                        </div>
                    );
                default:
                    return (
                        <div key={`key-board-${index}`} className={Styles["item"]} onClick={() => this.handlePressKeyBoard(action, key)}>
                            {key}
                        </div>
                    );
            }
        });

    render() {
        const { gameName, roundId, betChoice, odds } = this.props.betChoiceInfo;
        const { payout, betAmount } = this.state;

        return (
            <div ref={this.wrapperRef} className={`popup ${Styles["place-bet-modal"]}`}>
                <div className="popup-logo">
                    <span className="icon-small-logo"></span>
                </div>
                <div className="popup-closed-icon" onClick={this.closeModal}>
                    <span className="icon-close"></span>
                </div>
                <div className="popup-header">
                    <h1 className="popup-title">{gameName}</h1>
                    <p className="popup-sub-title">#{roundId}</p>
                </div>
                <div className={`w-100 btn-green ${Styles["bet-choice"]}`}>
                    <span className={Styles["choice-name"]}>{betChoice}</span> @ 1:{odds}
                </div>
                <InputGroup>
                    <InputGroupAddon addonType="prepend">
                        <InputGroupText className={Styles["input-group-text"]}>UUS</InputGroupText>
                    </InputGroupAddon>
                    <Input
                        className={Styles["custom-form-control"]}
                        value={betAmount}
                        type={"number"}
                        onChange={this.handleInputBetAmount}
                        min={0}
                    />
                </InputGroup>
                <ul className={Styles["bet-info"]}>
                    <li>
                        Payout: <span className={Styles["highlight"]}>{payout.toFixed(2)}</span>
                    </li>
                </ul>
                <div className={Styles["keyboard"]}>
                    <div className={Styles["board-common"]}>{this.renderKeyBoard(this.commonKeyBoard, "push")}</div>
                    <div className={Styles["board-special"]}>{this.renderKeyBoard(this.specialKeyBoard, "add")}</div>
                </div>
                <button onClick={this.placeBet} className="btn-orange w-100">
                    Bet
                </button>
            </div>
        );
    }
}
