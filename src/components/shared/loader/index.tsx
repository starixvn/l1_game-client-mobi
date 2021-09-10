import React from "react";

import Styles from "./loader.module.scss";

export default function Loader() {
    return <div className={Styles["loader"]} data-testid="loader"></div>;
}
