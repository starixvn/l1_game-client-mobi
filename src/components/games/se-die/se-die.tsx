import { Col, Row } from "reactstrap";

import BetContainer from "../../shared/bet-containter";
    GameBaseState,
    GameState,
} from "../../shared/game-base/type"
import MiniStatistic from "../../shared/statistic/line";
import Statistic from "../../shared/statistic/scoreboard";
import SeDieBetOption from "./se-die-bet-option";

const Choices = {
    odd: "odd",
    even: "even",
    red2: "red2",
    red3: "red3",
    red4: "red4",
    white3: "white3",
    white4: "white4",
};

class SeDie extends GameBase<GameBaseProps, GameBaseState> {
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
        const { gameName, id } = this.props
        const { remainingTime, roundId, gameState, roundHistory, gameConfigs, signedIn } = this.state;
        const typeDiceResult = ["red1", "red2", "red3", "red4"];
        return signedIn ? (
            <GameContainer gameName={gameName} remainingTime={remainingTime} roundId={roundId} gameState={gameState}>
                <BetContainer>
                    <Row>
                        <Col xs="4">
                            <SeDieBetOption choice={Choices.red4} odd={gameConfigs.odds[Choices.red4]}></SeDieBetOption>
                            <SeDieBetOption choice={Choices.red3} odd={gameConfigs.odds[Choices.red3]}></SeDieBetOption>
                        </Col>
                        <Col xs="4">
                            <SeDieBetOption choice={Choices.red2} odd={gameConfigs.odds[Choices.red2]}></SeDieBetOption>
                        </Col>
                        <Col xs="4">
                            <SeDieBetOption choice={Choices.white4} odd={gameConfigs.odds[Choices.white4]}></SeDieBetOption>
                            <SeDieBetOption choice={Choices.white3} odd={gameConfigs.odds[Choices.white3]}></SeDieBetOption>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <SeDieBetOption choice={Choices.odd} odd={gameConfigs.odds[Choices.odd]}></SeDieBetOption>
                        </Col>
                        <Col>
                            <SeDieBetOption choice={Choices.even} odd={gameConfigs.odds[Choices.even]}></SeDieBetOption>
                        </Col>
                    </Row>
                </BetContainer>
                <MiniStatistic results={roundHistory} gameState={gameState} countItem={20} typeDiceResult={typeDiceResult}></MiniStatistic>
                <Statistic results={roundHistory} gameState={gameState} typeDiceResult={typeDiceResult}></Statistic>
            </GameContainer>
        ) : (
            <div>Loading...</div>
        );
    }
}

export default SeDie
