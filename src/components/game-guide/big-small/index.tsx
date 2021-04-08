import React from "react";
import { useRouter } from "next/router";
import BigSmallGuideEN from "./en";
import BigSmallGuideVI from "./vi";

export enum GuideType {
    en,
    vi,
}

const BigSmallGuide = () => {
    const router = useRouter();
    const { locale, locales } = router;
    const component: JSX.Element[] = [<BigSmallGuideEN></BigSmallGuideEN>, <BigSmallGuideVI></BigSmallGuideVI>];
    let result: JSX.Element = <></>;
    locales.forEach((name, index) => {
        if (name === locale) {
            result = component[index];
        }
    });

    return result;
};
export default BigSmallGuide;
