import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const UM = () => (
    <div className="um">
        <img alt="SessionTimeout" src="/static/images/um-bg.jpg" className="img-fluid" />
        <p className="title">
            HỆ THỐNG ĐANG ĐƯỢC BẢO TRÌ.
            <br /> VUI LÒNG QUAY LẠI SAU.
        </p>
        <p className="highlight">Thời gian bảo trì từ 16:14 26/03/2021 đến 16:14 26/03/2021 (GMT +8)</p>
        <p>Sau thời gian bảo trì, bạn hãy đăng nhập lại để có thể tiếp tục chơi game.</p>
    </div>
);

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ["common"])),
    },
});

export default UM;
