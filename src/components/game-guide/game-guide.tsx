import React from "react";
import { useRouter } from "next/router";
import { GameConfigs, UserStakeLevel } from "../../components/shared/game-base/type";

type Props = {
    component: JSX.Element[];
};

export type PropsGuide = {
    gameConfigs: GameConfigs;
    userStakeLevel: UserStakeLevel;
};

const GameGuide = (props: Props) => {
    const { component } = props;
    const router = useRouter();
    const { locale, locales } = router;
    let result: JSX.Element = <></>;
    locales.forEach((name, index) => {
        if (name === locale) {
            result = component[index];
        }
    });

    return result;
};
export default GameGuide;
