export type Props = {
    result: ObjectResult;
    isSmall?: boolean;
    isAnimation?: boolean;
};

export interface ObjectResult {
    card: number;
    type: number;
}
