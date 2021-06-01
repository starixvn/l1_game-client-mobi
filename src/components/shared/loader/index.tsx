import React from "react";

import Styles from "./loader.module.scss";

export default function Loader() {
    return (
        <div className="overlay-mask-white">
            <div className={Styles.loader}>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    );
}
