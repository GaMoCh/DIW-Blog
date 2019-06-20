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
          <meta name="theme-color" content="#6435c9" />
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
