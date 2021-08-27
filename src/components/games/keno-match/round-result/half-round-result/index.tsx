import React from "react";

import { TeamProps, HalfRoundResultProps } from "./half-round-result-props";
import Styles from "./half-round-result.module.scss";

export default function HalfRoundResult({result, active, className, headerText}: HalfRoundResultProps) {
    const classNames = `${Styles.result} ${className} ${active ? Styles.active : ""}`,
    blueTeamProps: TeamProps = {
        result: result.blue,
        className: Styles.blue
    },
    redTeamProps:  TeamProps = {
        result: result.red,
        className: Styles.red
    };

    return (
        <div className={classNames}>
            <Team {...blueTeamProps}/>
            <div className={Styles["middle-column"]}>
                <div className={Styles.name}>
                   {headerText}
                </div>
            </div>
            <Team  {...redTeamProps} />
        </div>
    );
}

function Team({result, className}: TeamProps) {
    return (
        <div className={`${Styles.team} ${className}`}>
            <div className={Styles.row}>
                {result.slice(0, 4).map((number, index) => (
                    <Tie key={index} number={number} />
                ))}
            </div>
            <div className={Styles.row}>
                {result.slice(5, 9).map((number, index) => (
                    <Tie key={index} number={number} />
                ))}
            </div>
        </div>
    );
}

function Tie({ number }: { number: number }) {
    return (
        <div className={Styles.tie} style={{ transform: "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)" }}>
            {number}
        </div>
    );
}
