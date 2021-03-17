import React, { useEffect } from "react";

import useSocket from "../../../hooks/use-socket";
import BetTable from "../../shared/bet-table/bet-table";
import GameHeader from "../../shared/game-header/game-header";
import RoadMapStatistic from "../../shared/road-map-statistic/road-map-statistic";
import styles from "./se-die.module.scss";

type State = {
    gameName: string;
    roundId: number;
    remainingTime: number;
    gameState: number;
    showDisconnected: boolean;
};

export default function SeDie() {
    const fakeData = ["odd", "even", "even", "even", "odd"];
    const socket = useSocket("http://haproxy.lumigame.com:7002/user/sedie/", "/sedie/socket.io");

    useEffect(() => {
        if (socket && socket.connected) {
            socket.on("signedIn", () => {
                console.log("signedIn");
            });
        }
    }, [socket]);

    return (
        <div className={styles.container}>
            <GameHeader gameName="SeDie" roundId={13} gameState={1} remainingTime={40}></GameHeader>
            <BetTable></BetTable>
            <RoadMapStatistic results={fakeData} isWaitingResult={false}></RoadMapStatistic>
        </div>
    );
}

// export default class SeDie extends React.Component {

//   const socket = useSocket("http://haproxy.lumigame.com:7002/sedie/", "/sedie/socket.io");
//   public state: State;

//   constructor(props) {
//     super(props);

//     this.state = {
//       gameName: "SeDie",
//       roundId: 13,
//       remainingTime: 40,
//       gameState: 1,
//       showDisconnected: false,
//     };
//   }

//   async componentDidUpdate(prevProps) {
//     const gameServerUrl = UrlHelper.buildServerUrl(
//       configs.ssl,
//       "http",
//       "",
//       1,
//       "localhost"
//     );
//     const proxyRoute = configs.serverGameEndPoints[1].proxyRoute;
//     const nameSocket = "XocXoc";
//     const onConnectFailed = () => {};

//     const socket = initSockets(gameServerUrl, "", proxyRoute, onConnectFailed());

//     if(socket){
//       socket.on(nameSocket, (data) => {});
//     }

//   }

//   showWebSocketDisconnected() {
//     this.setState({ showDisconnected: true });
//   }

//   render() {
//     const betChoiceNameMapper = {
//       odd: "Odd",
//       even: "Even",
//     };

//     const fakeData = ["odd", "even", "even", "even", "odd"];

//     return (
//       <div className={styles.container}>
//         <GameHeader
//           gameName="SeDie"
//           roundId={13}
//           gameState={1}
//           remainingTime={40}
//         ></GameHeader>
//         <BetTable></BetTable>
//         <RoadMapStatistic
//           results={fakeData}
//           isWaitingResult={false}
//         ></RoadMapStatistic>
//       </div>
//     );
//   }
// }
