import styled from "styled-components";

export const MenuItensContainer = styled.section`
  align-items: center;
  display: flex;
  justify-content: flex-end;
  overflow-x: auto;
  white-space: nowrap;
  width: inherit;

  ::-webkit-scrollbar {
    display: none;
  }
`;

export const MenuItensWrapper = styled.div`
  align-items: center;
  display: flex;
`;

export const NoMargin = styled.span`
  margin: 0 !important;
`;

export const SpacedContainer = styled.div`
  display: inline-block;
  padding: 0 8px;

  :first-of-type {
    padding-left: 4px;
  }

  :last-of-type {
    padding-right: 16px;
  }

  > * {
    margin: 0 !important;
  }
`;

export const UserContainer = styled.div`
  align-items: center;
  display: flex;
`;
