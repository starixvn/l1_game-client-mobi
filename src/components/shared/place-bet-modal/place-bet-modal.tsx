import React, { ChangeEvent, Component } from "react";
import { Button, Col, Row } from "reactstrap";

import styles from "./place-bet-modal.module.scss";

type BetChoiceInfo = {
    gameName: string;
    roundId: number;
    betChoice: string;
    //Get odds, min/max bet ... on config (local storage or cache)
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
        const { gameName, roundId, betChoice } = this.props.betChoiceInfo;

        return (
            <div ref={this.wrapperRef} className={`${styles.container} container`}>
                <Row className={styles.header}>
                    <p>
                        {gameName} Draw No. {roundId}
                    </p>
                    <p>{betChoice} @ ...</p>
                </Row>
                <Row className={styles["bet-info"]}>
                    <input value={this.state.betAmount} type={"number"} onChange={this.updateBetAmount}></input>
                    <Button onClick={this.placeBet}>Bet</Button>
                </Row>
                <Row>
                    <Col xs={6}></Col>
                    <Col xs={6} className={"text-right"}></Col>
                </Row>
                <Row>
                    <Button onClick={this.closeModal}>Cancel</Button>
                </Row>
            </div>
        );
    }
}
