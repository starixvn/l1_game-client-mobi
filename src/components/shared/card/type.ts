import { ViewMode } from "../game-base/type";

export type Props = {
    result: ObjectResult;
    isSmall?: boolean;
    isAnimation?: boolean;
    viewMode?: ViewMode;
    customClassName?: string;
    isTicketDetail?: boolean;
};

export interface ObjectResult {
    card: number;
    type: number;
}
