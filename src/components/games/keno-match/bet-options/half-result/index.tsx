import React from "react";

import { KenoMatchResult } from "../../type";
import Styles from "./half-result.module.scss";

type Props = {
    result: KenoMatchResult;
    isHalfTime: boolean;
    active: boolean;
};

export default function HalfResult(props: Props) {
    return (
        <div
            className={`${Styles.result} ${props.isHalfTime ? Styles["half-time"] : Styles["full-time"]} ${
                props.active ? Styles.active : ""
            }`}
        >
            <Team result={props.result.blue} isHome={true} />
            <div className={Styles["middle-column"]}>
                <div className={Styles.name}>
                    {props.isHalfTime ? (
                        <>
                            <div>half</div>
                            <div>time</div>
                        </>
                    ) : (
                        <>
                            <div>full</div>
                            <div>time</div>
                        </>
                    )}
                </div>
            </div>
            <Team result={props.result.red} isHome={false} />
        </div>
    );
}

type TeamProps = {
    result: number[];
    isHome: boolean;
};

function Team(props: TeamProps) {
    return (
        <div className={`${Styles.team} ${props.isHome ? Styles.home : Styles.away}`}>
            <div className={Styles.row}>
                {props.result.slice(0, 4).map((number, index) => (
                    <Tie key={index} number={number} />
                ))}
            </div>
            <div className={Styles.row}>
                {props.result.slice(5, 9).map((number, index) => (
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
