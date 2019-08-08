import App, { Container } from "next/app";
import Head from "next/head";
import withReduxStore from "../lib/reduxStore";

import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

import GlobalStyle from "./globalStyle";

class MyApp extends App<any> {
  persistor: import("redux-persist").Persistor;

  constructor(props: any) {
    super(props);
    this.persistor = persistStore(props.reduxStore);
  }

  render() {
    const { Component, pageProps, reduxStore } = this.props;
    return (
      <Container>
        <Head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta name="theme-color" content="#6435c9" />
          <meta name="msapplication-TileColor" content="#1b1c1d" />
          <meta name="msapplication-config" content="/static/favicons/browserconfig.xml" />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/static/favicons/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/static/favicons/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/static/favicons/favicon-16x16.png"
          />
          <link rel="manifest" href="/static/favicons/site.webmanifest" />
          <link rel="mask-icon" href="/static/favicons/safari-pinned-tab.svg" color="#2185d0" />
          <link rel="shortcut icon" href="/static/favicons/favicon.ico" />
          <title>Blog</title>
        </Head>
        <GlobalStyle />
        <Provider store={reduxStore}>
          <PersistGate loading={<Component {...pageProps} />} persistor={this.persistor}>
            <Component {...pageProps} />
          </PersistGate>
        </Provider>
      </Container>
    );
  }
}

export default withReduxStore(MyApp);
