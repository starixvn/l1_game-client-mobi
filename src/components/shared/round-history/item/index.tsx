import React, { useState } from "react";

import ToolTip from "../../tool-tip";

interface Props<R, S> {
    children: React.ReactNode;
    renderRoundDetail: JSX.Element;
}

const RoundHistoryItem = <R, S>({ children, renderRoundDetail }: Props<R, S>) => {
    const [isOpenTooltip, setIsOpenTooltip] = useState(false);

    const openToolTip = () => {
        setIsOpenTooltip(true);
    };

    const closeToolTip = () => {
        setIsOpenTooltip(false);
    };

    return (
        <div onClick={openToolTip}>
            {children}
            {isOpenTooltip ? (
                <ToolTip isOpen={isOpenTooltip} onClose={closeToolTip}>
                    {renderRoundDetail}
                </ToolTip>
            ) : (
                ""
            )}
        </div>
    );
};

export default RoundHistoryItem;
