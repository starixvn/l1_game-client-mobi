import { GameBaseProps, GameConfigs, GameState, UserStakeLevel } from "../../components/shared/game-base/type";

export type GameContextModel = {
    totalBets: object;
    ownBets: object;
    gameSetting: GameBaseProps;
    roundId: number;
    remainingTime: number;
    gameConfigs: GameConfigs;
    gameState: GameState;
    userStakeLevel: UserStakeLevel;
    isCompactMode: boolean;
    playResultAnimation: boolean;
};
