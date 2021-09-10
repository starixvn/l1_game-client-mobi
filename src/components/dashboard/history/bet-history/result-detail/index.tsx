import React from "react";

import BaseDialog from "../../../../shared/base-dialog";
import { Props } from "./result-detail";
import { ModalType } from "../../../../shared/base-dialog/type";
import Styles from "./result-detail.module.scss";

export const ResultDetailContainer: React.FC<Props> = (props) => {
    const { children, roundId, closeModal, gameName } = props;
    return (
        <BaseDialog type={ModalType.Center} isOpen={true} onCloseModal={closeModal}>
            <div key={roundId} className={Styles["popup-result-detail"]}>
                <div className={Styles["game-name"]}>{gameName}</div>
                <span className={`icon-close ${Styles["icon-close"]}`} onClick={() => closeModal()}></span>
                <div className={Styles["roundId"]}>#{roundId}</div>
                {children}
            </div>
        </BaseDialog>
    );
};

export default ResultDetailContainer;
