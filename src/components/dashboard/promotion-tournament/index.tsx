import Styles from "./promotion-tournament.module.scss";

import { useEffect, useMemo, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import BaseDialog from "../../shared/base-dialog";
import { useTranslation } from "next-i18next";
import Loader from "../../shared/loader";
import { buildPromotionSiteUrl } from "../../../helpers/url-helper";
import { browserVersion, isIOS, isMobileOnly } from "react-device-detect";
import { ModalEventActionType, useModalContext, useModalDispatch } from "../../../contexts/modal-context";
import { useAuthContext } from "../../../contexts/auth";
import { LanguageLocaleMapper } from "../../../common/constants";

export const PromotionTournament = () => {
    const { t, i18n } = useTranslation();
    const { session } = useAuthContext();
    const { enabledPromotionTournament } = useModalContext();
    const dispatch = useModalDispatch();
    const wrapperRef = useRef<HTMLIFrameElement>();
    const wrapperIframeRef = useRef<HTMLIFrameElement>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [heightGuide, setHeightGuide] = useState<number>(0);
    const [widthGuide, setWidthGuide] = useState<number>(0);

    const promotionSiteUrl = useMemo(() => {
        const params = {
            sessionId: Buffer.from(session?.ss || "").toString("base64"),
            username: session.username,
            language: LanguageLocaleMapper[i18n.language],
        };
        const searchParams = new URLSearchParams();
        Object.keys(params).forEach((key) => params[key] !== undefined && searchParams.append(key, params[key]));

        return `${buildPromotionSiteUrl()}/?${searchParams.toString()}`;
    }, [session?.ss, session?.username, i18n.language]);

    const handleResize = () => {
        if (wrapperRef?.current) {
            setHeightGuide(wrapperRef.current.clientHeight);
            setWidthGuide(wrapperRef.current.clientWidth);
        }
    };

    const hideSpinner = () => {
        setIsLoading(false);
        handleResize();
    };

    useEffect(() => {
        const isIOSBrowserVersion15 = isMobileOnly && isIOS && browserVersion === "15";
        !isIOSBrowserVersion15 && window.addEventListener("resize", handleResize);

        handleResize();

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [wrapperRef]);

    const onClose = () => {
        dispatch({ type: ModalEventActionType.TogglePromotionTournamentModal, payload: false });
    };

    return useMemo(
        () =>
            enabledPromotionTournament && (
                <BaseDialog onCloseModal={onClose} enableBackdrop={true} extraClass={Styles["override-popup-background"]}>
                    <div className={Styles["popup-container"]}>
                        <div className={Styles["main-content"]}>
                            <div className={Styles["container-site"]} ref={wrapperRef}>
                                <iframe
                                    ref={wrapperIframeRef}
                                    key={uuidv4()}
                                    className={Styles["site-iframe"]}
                                    src={promotionSiteUrl}
                                    referrerPolicy="strict-origin-when-cross-origin"
                                    height={heightGuide}
                                    width={widthGuide}
                                    scrolling="auto"
                                    onLoad={() =>
                                        setTimeout(() => {
                                            hideSpinner();
                                        }, 300)
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </BaseDialog>
            ),
        [enabledPromotionTournament, promotionSiteUrl, isLoading, heightGuide, widthGuide]
    );
};
