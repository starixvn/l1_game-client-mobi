import { ViewMode } from "../game-base/type";

export type Props = {
    result: ObjectResult;
    isSmall?: boolean;
    isAnimation?: boolean;
    viewMode?: ViewMode;
};

export interface ObjectResult {
    card: number;
    type: number;
}
