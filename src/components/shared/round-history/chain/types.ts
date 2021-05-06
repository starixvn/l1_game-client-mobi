import { Round } from "../../../../types";

export type PropsDot<R, S> = {
    children: React.ReactNode;
    renderRoundDetail: JSX.Element;
    targetName: string;
};

export type Props<R, S> = {
    roundHistory: Round<R, S>[];
    gameState: number;
    renderRoundDetail: (round: Round<R, S>, t: Function) => JSX.Element;
    renderGameDot: (round: Round<R, S>, isLockingBet: () => boolean, index: number, numberOfItems: number) => JSX.Element;
};
