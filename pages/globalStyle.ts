import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
    html {
      height: 100%;
      scroll-behavior: smooth;
    }

    body {
      background-color: #1b1c1d;
      height: inherit;
      margin: 0;
      overflow: auto;
    }

    #__next {
      height: inherit;
    }
`;

export default GlobalStyle;
