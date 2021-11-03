import React from "react";
import { useGameContext } from "../../../contexts/game-context/game-context";

import BallNumber from "../ball-number";
import Styles from "./team-result.module.scss";

type Props = {
    result: number[];
    hasAnimation?: boolean;
    customizeClassName?: string;
};

export default function TeamResult({ result, hasAnimation = false, customizeClassName }: Props) {
    const { gameSetting } = useGameContext();

    return (
        <div
            className={`${Styles.team} ${Styles[gameSetting?.gameName.toLocaleLowerCase()]} ${
                customizeClassName ? Styles[customizeClassName] : ""
            }`}
            data-testid="team-component"
        >
            <div className={Styles.row} data-testid="team-result-row-component">
                {result.map((number: number, index: number) => (
                    <BallNumber key={index} value={number} hasAnimation={hasAnimation} />
                ))}
            </div>
        </div>
    );
}
