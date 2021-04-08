import React from "react";
import { useRouter } from "next/router";
import SeDieGuideEN from "./en";
import SeDieGuideVI from "./vi";

export enum GuideType {
    en,
    vi,
}

const SeDieGuide = () => {
    const router = useRouter();
    const { locale } = router;
    const listLocale = ["en", "vi"];
    const component: JSX.Element[] = [<SeDieGuideEN></SeDieGuideEN>, <SeDieGuideVI></SeDieGuideVI>];
    let result: JSX.Element = <></>;
    listLocale.forEach((name, index) => {
        if (name === locale) {
            result = component[index];
        }
    });

    return result;
};
export default SeDieGuide;
