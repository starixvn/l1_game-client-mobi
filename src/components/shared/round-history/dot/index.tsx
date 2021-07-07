import Styles from "./dot.module.scss";

type Props = {
    choice?: string;
    row?: number;
    col?: number;
    value?: number | string | object;
    highlight?: boolean;
    size?: string;
};

export const RoundDot: React.FunctionComponent<Props> = ({ choice = "even", value, highlight = false, size = "" }) => {
    const classDotName = `dot-${choice}`;
    return <div className={`${Styles[classDotName]} ${highlight ? "highlight-current-result" : ""} ${Styles[size]}`}>{value}</div>;
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
