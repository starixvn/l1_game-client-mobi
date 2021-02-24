import React, { Component, HtmlHTMLAttributes, useState } from "react";
import styles from "./place-bet-modal.module.scss";
import { Row, Col, Button } from "reactstrap";

type BetChoiceInfo = {
  gameName: string;
  roundId: number;
  betChoice: string;
  //Get odds, min/max bet ... on config (local storage or cache)
};

type Props = {
  isShow: boolean;
  handleModalStatus: Function;
  onPlaceBet: Function;
  betChoiceInfo: BetChoiceInfo;
};

type State = {
  betAmount: number;
  payOut: number;
};

export default class PlaceBetModal extends Component<Props, State> {
  wrapperRef: React.RefObject<HTMLDivElement>;

  constructor(props: Props) {
    super(props);

    this.wrapperRef = React.createRef<HTMLDivElement>();
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.setWrapperRef = this.setWrapperRef.bind(this);

    this.state = {
      betAmount: 0,
      payOut: 0,
    };
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmountMount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleClickOutside(event) {
    if (
      this.props.isShow &&
      this.wrapperRef &&
      !this.wrapperRef.current.contains(event.target)
    ) {
      this.props.handleModalStatus(false);
    }
  }

  render() {
    const { gameName, roundId, betChoice } = this.props.betChoiceInfo;

    return (
      <div
        ref={this.wrapperRef}
        className={`${styles.container} container`}
        hidden={!this.props.isShow}
      >
        <Row className={styles["header"]}>
          <p>
            {gameName} Draw No. {roundId}
          </p>
          <p>{betChoice} @ ...</p>
        </Row>
        <Row className={styles["bet-info"]}>
          <input type={"number"}></input>
          <Button>Bet</Button>
        </Row>
        <Row className={styles["summary"]}>
          <Col xs={6}></Col>
          <Col xs={6} className={"text-right"}></Col>
        </Row>
        <Row className={styles["action"]}>
          <Button onClick={() => this.props.handleModalStatus(false)}>
            Cancel
          </Button>
        </Row>
      </div>
    );
  }
}
