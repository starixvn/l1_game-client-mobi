import { withTranslation } from "next-i18next";
import { withRouter } from "next/router";
import React from "react";

import { SeDie } from "../se-die/se-die";

class MiniSeDie extends SeDie {}

export default withRouter(withTranslation()(MiniSeDie));
