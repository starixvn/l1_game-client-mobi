import React from "react";
import { useRouter } from "next/router";
import FishPrawnCrabGuideEN from "./en";
import FishPrawnCrabGuideVI from "./vi";

export enum GuideType {
    en,
    vi,
}

const FishPrawnCrab = () => {
    const router = useRouter();
    const { locale, locales } = router;
    const component: JSX.Element[] = [<FishPrawnCrabGuideEN></FishPrawnCrabGuideEN>, <FishPrawnCrabGuideVI></FishPrawnCrabGuideVI>];
    let result: JSX.Element = <></>;
    locales.forEach((name, index) => {
        if (name === locale) {
            result = component[index];
        }
    });

    return result;
};
export default FishPrawnCrab;
