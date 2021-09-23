import React from "react";

import BallNumber from "../ball-number";
import Styles from "./team-result.module.scss";

type Props = {
    result: number[];
    hasAnimation?: boolean;
    isTicketHistory?: boolean;
};

export default function TeamResult({ result, hasAnimation = false, isTicketHistory = false }: Props) {
    return (
        <div className={`${Styles.team} ${isTicketHistory ? Styles["ticket-history"] : ""}`} data-testid="team-component">
            <div className={Styles.row} data-testid="team-result-row-component">
                {result.map((number: number, index: number) => (
                    <BallNumber key={index} value={number} hasAnimation={hasAnimation} />
                ))}
            </div>
        </div>
    );
}
