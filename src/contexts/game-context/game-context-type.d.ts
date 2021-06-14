import { GameBaseProps, GameConfigs, GameState, UserStakeLevel, DisplayChips, ModeView } from "../../components/shared/game-base/type";

export type GameContextModel = {
    totalBets: object;
    ownBets: object;
    gameSetting: GameBaseProps;
    roundId: number;
    remainingTime: number;
    gameConfigs: GameConfigs;
    gameState: GameState;
    userStakeLevel: UserStakeLevel;
    modeView: ModeView;
    playResultAnimation: boolean;
    displayChips: DisplayChips;
    isShowBlink: boolean;
    showTotalResult: boolean;
};
