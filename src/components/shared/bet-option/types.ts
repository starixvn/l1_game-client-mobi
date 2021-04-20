import { GameState } from "../game-base/type";

export enum HighlightType {
    None,
    Blink,
    Background,
}

export type Props = {
    choice: string;
    odd: number;
    children: React.ReactNode;
    isHighlight: boolean;
    isDisplayOdd?: boolean;
    gameState: GameState;
};
