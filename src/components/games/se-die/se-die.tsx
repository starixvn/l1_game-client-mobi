import React, { useEffect, useState } from "react";

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

enum GameState {
    Disabled,
    InRound,
    LockingBet,
    Waiting,
    DisplayResult,
}

interface GameConfigs {
    odds: object;
    minbet: number;
    maxbet: number;
    choices_maxbet: object;
    enableFreeBet: boolean;
}

export default function SeDie() {
    const fakeData = ["odd", "even", "even", "even", "odd"];
    const socket = useSocket("http://haproxy.lumigame.com:7002/user/xocxoc", "/sedie/socket.io");
    const [signedIn, setSignedIn] = useState<boolean>(false);
    const [remainingTime, setRemainingTime] = useState<number>(0);
    const [gameState, setGameState] = useState<GameState>(GameState.Disabled);
    const [gameConfigs, setGameConfigs] = useState<GameConfigs>(null);
    const [roundHistory, setRoundHistory] = useState(null);

    function handleEvent(payload: any) {
        if (payload.um) {
            setGameState(GameState.Disabled);
        }
        if (payload.remainingTime) {
            handleRemainingTime(payload.remainingTime);
        }
        if (payload.gameConfigs) {
            handleGameConfigs(payload.gameConfigs);
        }
        if (payload.roundHistory) {
            setRoundHistory(payload.roundHistory);
        }
    }

    function handleRoundHistory(rounds) {}

    function handleGameConfigs(configs: GameConfigs) {
        setGameConfigs(configs);
    }

    function handleRemainingTime(time: number) {
        setRemainingTime(time);
        setGameState(getGameState(time));
    }

    function getGameState(time: number) {
        if (time > 30) {
            return GameState.Waiting;
        }

        if (time > 5 && time <= 30) {
            return GameState.InRound;
        }

        if (time <= 5) {
            return GameState.LockingBet;
        }
    }

    useEffect(() => {
        if (socket) {
            socket.on("signedIn", () => {
                setSignedIn(true);
                socket.emit("inGame");
            });
            socket.on("XocXoc", handleEvent);
        }
    }, [socket]);

    if (signedIn) {
        return (
            <div className={styles.container}>
                <GameHeader gameName="SeDie" roundId={13} gameState={gameState} remainingTime={remainingTime}></GameHeader>
                <BetTable></BetTable>
                <RoadMapStatistic results={fakeData} isWaitingResult={false}></RoadMapStatistic>
            </div>
        );
    } else {
        return <div>Loading...</div>;
    }
}
