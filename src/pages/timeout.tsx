import React from "react";
import Link from "next/link";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const NotFound = () => (
    <div className="session-timeout">
        <img alt="SessionTimeout" className="img-fluid" src="/static/images/error-session-bg.jpg" />
        <p className="title">
            Phiên đăng nhập của bạn đã hết hạn, hoặc bạn chưa có đăng nhập. <br /> Vui lòng đóng cửa sổ game và thử đăng nhập lại.
        </p>
        <p>
            Your session has timed out or you have not logged in yet. <br /> Please close the current windows and try to login again.
        </p>
    </div>
);

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ["common"])),
    },
});

export default NotFound;
