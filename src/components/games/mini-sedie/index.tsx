import { withTranslation } from "next-i18next";
import { withRouter } from "next/router";
import React from "react";

import { SeDie } from "../se-die/se-die";

class MiniSeDie extends SeDie {
    get Choices() {
        return ["even", "odd", "red3", "white3", "red4", "white4"];
    }
}

export default withRouter(withTranslation()(MiniSeDie));
