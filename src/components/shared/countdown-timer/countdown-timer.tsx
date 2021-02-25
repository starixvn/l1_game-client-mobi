import React from "react";
import * as Auth from "../../../common/auth/AuthManager";

type Props = {
  remainingTime: number;
};

type State = {
  currentTime: number;
  timeRecheckIn: number;
};

export default class CountdownTimer extends React.Component<Props, State> {
  private interval: NodeJS.Timeout;

  constructor(props) {
    super(props);

    this.state = {
      currentTime: props.remainingTime,
      timeRecheckIn: 10
    };
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      if( this.state.timeRecheckIn == 0){
        Auth.reCheckIn();
        this.setState({timeRecheckIn : 60});
      }

      if (this.state.currentTime > 0) {
        this.setState({ currentTime: this.state.currentTime - 1});
      }

      if (this.state.timeRecheckIn > 0) {
        this.setState({timeRecheckIn: this.state.timeRecheckIn - 1});
      }
    }, 1000);
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  render() {
    const { currentTime, timeRecheckIn } = this.state;

    return <div>{currentTime} <div>{timeRecheckIn}</div></div>;
  }
}
