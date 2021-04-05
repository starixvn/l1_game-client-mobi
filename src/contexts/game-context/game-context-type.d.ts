import { GameState, GameConfigs } from "../../components/shared/game-base/type";

export type GameContextModel = {
    updateGameState: (gameState: GameState) => void;
    placeBet: (betChoice: string, amount: number) => void;
    totalBets: object;
    ownBets: object;
    gameName: string;
    roundId: number;
    gameConfigs: GameConfigs;
    getBetHistory: (page: number) => void;
    betHistory: object;
};
