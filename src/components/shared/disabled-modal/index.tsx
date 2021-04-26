import React from "react";

import BaseDialog from "../base-dialog";

type Props = {
    disabledMessage: string;
};

const DisabledModal: React.FC<Props> = ({ disabledMessage }) => <BaseDialog>{disabledMessage}</BaseDialog>;

export default DisabledModal;
