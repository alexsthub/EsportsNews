import { createGlobalStyle } from "styled-components";
export const GlobalStyles = createGlobalStyle`
  body {
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    transition: all 0.2s linear;
  }
  .hover-background:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.hoverColor};
  }
  .article-description {
    color: ${({ theme }) => theme.articleDescription};
  }
  `;
