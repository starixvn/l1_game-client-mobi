import React from 'react';

import Styles from './dot.module.scss';

type Props = {
    red?: boolean;
};

const SeDieDot: React.FunctionComponent<Props> = ({ red = false }) => {
    return <div className={`${red ? Styles["dot-red"] : Styles["dot-white"]}`}></div>;
};

export default SeDieDot;
