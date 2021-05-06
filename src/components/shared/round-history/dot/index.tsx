import Styles from "./dot.module.scss";

type Props = {
    choice?: string;
    row?: number;
    col?: number;
    value?: number;
    highlight?: boolean;
};

export const RoundDot: React.FunctionComponent<Props> = ({ choice = "even", value, highlight = false }) => {
    const classDotName = `dot-${choice}`;
    return <div className={`${Styles[classDotName]} ${highlight ? "highlight-current-result" : ""}`}>{value}</div>;
};

export const RoundDotGrid: React.FunctionComponent<Props> = ({ choice = "even", value, col, row }) => {
    const classDotName = `dot-${choice}`;
    return (
        <div
            className={Styles[classDotName]}
            style={{
                gridColumnStart: col.toString(),
                gridRowStart: row.toString(),
            }}
        >
            {value}
        </div>
    );
};
