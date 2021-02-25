import React from "react";
import * as Auth from "../../../common/auth/AuthManager";

type Props = {
  remainingTime: number;
};

type State = {
  currentTime: number;
};

export default class CountdownTimer extends React.Component<Props, State> {
  private interval: NodeJS.Timeout;

  constructor(props) {
    super(props);

    this.state = {
      currentTime: props.remainingTime,
    };
  }

  componentDidMount() {
    this.interval = setInterval(() => {

      if (this.state.currentTime > 0) {
        this.setState({ currentTime: this.state.currentTime - 1});
      }
    }, 1000);
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  render() {
    const { currentTime } = this.state;

    return <div>{currentTime}</div>;
  }
}
