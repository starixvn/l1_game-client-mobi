import { GameState } from "../game-base/type";

type Props = {
    gameState: GameState;
};

type BetModalInfo = {
    gameId: string;
    gameName: string;
    choice: string;
    roundId: number;
};
