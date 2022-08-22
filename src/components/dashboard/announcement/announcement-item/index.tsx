import React, { useEffect, useRef, useState } from "react";
import { Props } from "./types";

const AnnouncementItem: React.FunctionComponent<Props> = ({ title, content, isActive }) => {
    console.log(title, content, isActive);
    return (
        <>
            <span>{title}</span>
            <p>{content}</p>
            <button disabled={isActive}>Join Game</button>
        </>
    );
};

export default AnnouncementItem;
