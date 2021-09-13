import Document, { DocumentContext, Head, Html, Main, NextScript } from "next/document";
import React from "react";

export default class extends Document {
    static async getInitialProps(ctx: DocumentContext) {
        const initialProps = await Document.getInitialProps(ctx);
        const userAgent = ctx.req?.headers["user-agent"] ?? "";

        initialProps.styles = userAgent.includes("iPhone") ? "isIOS-mobile" : "";

        return { ...initialProps };
    }

    render() {
        return (
            <Html className={this.props.styles as string}>
                <Head>
                    <meta name="apple-mobile-web-app-capable" content="yes" />
                </Head>
                <body className={this.props.styles as string}>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}
