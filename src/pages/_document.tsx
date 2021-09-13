import Document, { DocumentContext, Head, Html, Main, NextScript } from "next/document";
import React from "react";
import { isIOS, isMobileOnly } from "react-device-detect";

export default class extends Document {
    static async getInitialProps(ctx: DocumentContext) {
        const initialProps = await Document.getInitialProps(ctx);

        return { ...initialProps };
    }

    render() {
        return (
            <Html className={isIOS && isMobileOnly ? "isIOS-mobile" : ""}>
                <Head>
                    <meta name="apple-mobile-web-app-capable" content="yes" />
                </Head>
                <body className={isIOS && isMobileOnly ? "isIOS-mobile" : ""}>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}
