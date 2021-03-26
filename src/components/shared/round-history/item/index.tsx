import React, { useState } from "react";

import ToolTip from "../../tool-tip";

interface Props<R, S> {
    children: React.ReactNode;
    round: Round<R, S>;
    renderRoundDetail: (round: Round<R, S>) => void;
}

const RoundHistoryItem = <R, S>({ children, round, renderRoundDetail }: Props<R, S>) => {
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
            {isOpenTooltip && (
                <ToolTip isOpen={isOpenTooltip} onClose={closeToolTip}>
                    {() => renderRoundDetail(round)}
                </ToolTip>
            )}
        </div>
    );
};

export default RoundHistoryItem;
