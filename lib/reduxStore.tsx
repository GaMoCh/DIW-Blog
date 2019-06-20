import { Component } from "react";
import { initializeStore, ApplicationState } from "../store";

const isServer = typeof window === "undefined";
const __NEXT_REDUX_STORE__ = "__NEXT_REDUX_STORE__";

function getOrCreateStore(initialState?: ApplicationState) {
  if (isServer) {
    return initializeStore(initialState);
  }

  if (!(window as any)[__NEXT_REDUX_STORE__]) {
    (window as any)[__NEXT_REDUX_STORE__] = initializeStore(initialState);
  }

  return (window as any)[__NEXT_REDUX_STORE__];
}

export default (App: any) => {
  return class AppWithRedux extends Component {
    reduxStore: any;

    static async getInitialProps(appContext: { ctx: { reduxStore: any } }) {
      const reduxStore = getOrCreateStore();

      appContext.ctx.reduxStore = reduxStore;

      let appProps = {};

      if (typeof App.getInitialProps === "function") {
        appProps = await App.getInitialProps(appContext);
      }

      return {
        ...appProps,
        initialReduxState: reduxStore.getState()
      };
    }

    constructor(props: any) {
      super(props);
      this.reduxStore = getOrCreateStore(props.initialReduxState);
    }

    render() {
      return <App {...this.props} reduxStore={this.reduxStore} />;
    }
  };
};
