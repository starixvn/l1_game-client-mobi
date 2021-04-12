import React from "react";
import { useRouter } from "next/router";

type Props = {
    component: JSX.Element[];
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
