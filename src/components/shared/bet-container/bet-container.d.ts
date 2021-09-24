import { GameState } from "../game-base/type";

type Props = {
    gameState: GameState;
    isInRound?: boolean;
};

type BetModalInfo = {
    choice: string;
};
