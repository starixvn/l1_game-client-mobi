import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";

const TimeOut = () => {
    const router = useRouter();
    const { theme } = useTheme();
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        setIsLoading(false);
    }, [router.isReady]);

    if (isLoading) {
        return <></>;
    }
    return (
        <div className="error-page">
            <img alt="SessionTimeout" className="error-background" src={`/static/images/error-session-${theme}.svg`} />
            <p className="session-timeout-title">
                Phiên đăng nhập của bạn đã hết hạn, hoặc bạn chưa có đăng nhập. <br /> Vui lòng đóng cửa sổ game và thử đăng nhập lại.
            </p>
            <p>
                Your session has timed out or you have not logged in yet. <br /> Please close the current windows and try to login again.
            </p>
        </div>
    );
};

export default TimeOut;
