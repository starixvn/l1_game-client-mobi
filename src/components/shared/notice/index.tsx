import React, { useEffect } from "react";

import Styles from "./notice.module.scss";

type Props = {
    message: string;
    onClose: () => void;
    duration?: number;
};

const Notice: React.FC<Props> = ({ message, onClose, duration = 3 }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, duration * 1000);

        return () => clearTimeout(timer);
    }, []);

    return <div className={Styles.notice}>{message}</div>;
};

export default Notice;
