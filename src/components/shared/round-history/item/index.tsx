import React, { useState } from "react";
import { Tooltip } from "reactstrap";
import ContainerToolTip from "../../tool-tip";

interface Props<R, S> {
    children: React.ReactNode;
    renderRoundDetail: JSX.Element;
    targetName: string;
}

const RoundHistoryItem = <R, S>({ children, renderRoundDetail, targetName }: Props<R, S>) => {
    const [isOpenTooltip, setIsOpenTooltip] = useState(false);
    const toggle = () => setIsOpenTooltip(!isOpenTooltip);

    return (
        <>
            <div id={targetName}>{children}</div>
            <ContainerToolTip isOpen={isOpenTooltip} onClose={toggle}>
                <Tooltip trigger="click" placement="top" isOpen={isOpenTooltip} target={targetName} toggle={toggle}>
                    {renderRoundDetail}
                </Tooltip>
            </ContainerToolTip>
        </>
    );
};

export default RoundHistoryItem;
