import { SocketContextProvider } from "../../contexts/socket";
import GameBase from "../../shared/game-base";
import { GameBaseProps, GameBaseState, GameState } from "../../shared/game-base/type";
import GameContainer from "../../shared/game-container";
import MiniStatistic from "../../shared/statistic/line";
import Statistic from "../../shared/statistic/scoreboard";
import SeDieBetOptions from "./se-die-bet-options";
import { Result, SettlementResult, DiceColor } from "./sedie";
import { StatisticItem, MiniStatisticItem } from "../../shared/statistic/type";
import Styles from "./se-die-statistic.module.scss";
import SeDieStatistic from "./se-die-statistic";

export const typeDiceResult = ["red1", "red2", "red3", "red4"];
const handleStatisticDiceMini = (result: Result, roundId: number, settlementResult: SettlementResult): MiniStatisticItem => {
    const resultHandle: MiniStatisticItem = {
        class: "item-red",
        count: 0,
        settlementResult: settlementResult,
        roundId: roundId,
    };
    let countType = 0;
    typeDiceResult.forEach((type) => {
        if (result[type]) {
            countType++;
        }
    });
    resultHandle.count = countType;

    if (countType % 2) {
        resultHandle.class = "mini-item-red";
    } else {
        resultHandle.class = "mini-item-white";
    }

    return resultHandle;
};

const handleColorDice = (data: Result): DiceColor => {
    const result: DiceColor = {
        class: "item-red",
        count: 0,
    };
    let countType = 0;
    typeDiceResult.forEach((type) => {
        if (data[type]) {
            countType++;
        }
    });
    result.count = countType;

    if (countType % 2) {
        result.class = "item-red";
    } else {
        result.class = "item-white";
    }

    return result;
};

export interface StatisticType {
    data: Array<DataType>;
}

export interface DataType {
    type: DiceColor;
    value: number;
    roundId: number;
}

const convertDataStatistic = (settlementResult: SettlementResult, resultDices: Result, roundId: number) => {
    const tmpData: StatisticItem = {
        type: {
            class: "",
            count: 0,
        },
        value: 0,
        roundId: 0,
    };
    if (settlementResult.even) {
        tmpData.value = 0;
    }

    if (settlementResult.odd) {
        tmpData.value = 1;
    }

    tmpData.type = handleColorDice(resultDices);
    tmpData.roundId = roundId;

    return tmpData;
};

const itemStatistic = (data, col, row, roundId) => {
    if (data.type) {
        return (
            <div
                key={roundId}
                className={Styles[data.type.class]}
                style={{
                    gridColumnStart: col.toString(),
                    gridRowStart: row.toString(),
                }}
            >
                {data.type.count}
            </div>
        );
    } else {
        return <div></div>;
    }
};

const miniItemStatistic = (result) => {
    return <div key={result.roundId} className={Styles[result.class]}></div>;
};

class SeDie extends GameBase<GameBaseProps, GameBaseState<Result, SettlementResult>> {
    constructor(props: GameBaseProps) {
        super(props);

        this.state = {
            signedIn: false,
            gameState: GameState.None,
            remainingTime: 0,
            gameConfigs: null,
            roundHistory: [],
            roundId: 0,
        };
    }

    render() {
        const { gameName, id } = this.props;
        const { remainingTime, roundId, gameState, roundHistory, gameConfigs, signedIn, result, settlementResult } = this.state;

        return signedIn ? (
            <GameContainer gameId={id} gameName={gameName} remainingTime={remainingTime} roundId={roundId} gameState={gameState}>
                <SocketContextProvider value={this.socket}>
                    <SeDieBetOptions
                        odds={gameConfigs.odds}
                        gameState={gameState}
                        result={result}
                        settlementResult={settlementResult}
                    ></SeDieBetOptions>
                </SocketContextProvider>

                <MiniStatistic
                    results={roundHistory}
                    gameState={gameState}
                    countItem={14}
                    miniItemStatistic={miniItemStatistic}
                    handleStatisticDiceMini={handleStatisticDiceMini}
                ></MiniStatistic>
                <SeDieStatistic results={roundHistory} gameState={gameState}></SeDieStatistic>
                <Statistic
                    results={roundHistory}
                    gameState={gameState}
                    itemStatistic={itemStatistic}
                    convertDataStatistic={convertDataStatistic}
                ></Statistic>
            </GameContainer>
        ) : (
            <div>Loading...</div>
        );
    }
}

export default SeDie;
