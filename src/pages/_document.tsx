import Document, { DocumentContext, Head, Html, Main, NextScript } from "next/document";
import React from "react";

export default class extends Document {
    static async getInitialProps(ctx: DocumentContext) {
        const initialProps = await Document.getInitialProps(ctx);

        return { ...initialProps };
    }

    render() {
        const configFile ="./c.js?" + Date.now; 

        return (
            <Html>
                <Head>
                    <meta name="apple-mobile-web-app-capable" content="yes" />
                    <script type="text/javascript" src={configFile} ></script>
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}
