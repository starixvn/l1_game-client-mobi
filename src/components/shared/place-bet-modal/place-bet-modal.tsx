import React, { ChangeEvent, Component } from "react";
import { InputGroupAddon, InputGroup, InputGroupText, Input } from "reactstrap";

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
    payOut: number;
};

export default class PlaceBetModal extends Component<Props, State> {
    wrapperRef: React.RefObject<HTMLDivElement>;

    constructor(props: Props) {
        super(props);

        this.wrapperRef = React.createRef();

        this.state = {
            betAmount: 0,
            payOut: 0,
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

    updateBetAmount = (event) => {
        this.setState({ betAmount: event.target.value });
    };

    placeBet = () => {
        this.props.onPlaceBet(this.props.betChoiceInfo.betChoice, this.state.betAmount);
        this.closeModal();
    };

    render() {
        const { gameName, roundId, betChoice, odds } = this.props.betChoiceInfo;

        return (
            <div ref={this.wrapperRef} className={Styles["modal"]}>
                <div className={Styles["logo"]}>
                    <span className="icon-small-logo"></span>
                </div>
                <div className={Styles["icon-closed"]} onClick={this.closeModal}>
                    <span className="icon-close"></span>
                </div>
                <div className={Styles["modal-header"]}>
                    <h1 className={Styles["modal-title"]}>{gameName}</h1>
                    <p className={Styles["modal-sub-title"]}>#{roundId}</p>
                </div>
                <div className={`w-100 ${Styles["btn-green"]} ${Styles["bet-choice"]}`}>
                    <span className={Styles["choice-name"]}>{betChoice}</span> @ 1:{odds}
                </div>
                <InputGroup>
                    <InputGroupAddon addonType="prepend">
                        <InputGroupText className={Styles["input-group-text"]}>UUS</InputGroupText>
                    </InputGroupAddon>
                    <Input
                        className={Styles["custom-form-control"]}
                        value={this.state.betAmount}
                        type={"number"}
                        onChange={this.updateBetAmount}
                    />
                </InputGroup>
                <ul className={Styles["bet-info"]}>
                    <li>
                        Bet Credit: <span className={Styles["highlight"]}>4,137.79</span>
                    </li>
                    <li>
                        Payout: <span className={Styles["highlight"]}>0.00</span>
                    </li>
                </ul>
                <div className={Styles["keyboard"]}>
                    <div className={Styles["board-common"]}>
                        <div className={Styles["item"]}>1</div>
                        <div className={Styles["item"]}>2</div>
                        <div className={Styles["item"]}>3</div>
                        <div className={Styles["item"]}>4</div>
                        <div className={Styles["item"]}>5</div>
                        <div className={Styles["item"]}>
                            <span className="icon-remove"></span>
                        </div>
                        <div className={Styles["item"]}>6</div>
                        <div className={Styles["item"]}>7</div>
                        <div className={Styles["item"]}>8</div>
                        <div className={Styles["item"]}>9</div>
                        <div className={Styles["item"]}>0</div>
                        <div className={Styles["item"]}>00</div>
                    </div>
                    <div className={Styles["board-special"]}>
                        <div className={Styles["item"]}>+1</div>
                        <div className={Styles["item"]}>+5</div>
                        <div className={Styles["item"]}>+10</div>
                        <div className={Styles["item"]}>+50</div>
                        <div className={Styles["item"]}>+100</div>
                        <div className={Styles["item"]}>+200</div>
                        <div className={Styles["item"]}>+500</div>
                        <div className={Styles["item"]}>Max</div>
                    </div>
                </div>
                <button onClick={this.placeBet} className={`w-100 ${Styles["btn-orange"]}`}>
                    Bet
                </button>
            </div>
        );
    }
}
