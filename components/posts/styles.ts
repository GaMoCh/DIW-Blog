import styled from "styled-components";

export const AddPostContainer = styled.section`
  display: flex !important;
  justify-content: center;
  margin: 32px auto;
`;

export const AlignedInCenter = styled.div`
  display: flex;
  justify-content: center;
`;

export const AuthorContainer = styled.div`
  align-items: center;
  display: flex;
`;

export const BlueInput = styled.div`
  :focus-within {
    border-color: #2185d0 !important;
    caret-color: #2185d0;
  }
`;

export const LikesCounterContainer = styled.section`
  align-items: center;
  display: flex;
  flex-direction: column;
  margin: 32px 0;
`;

export const NoMargin = styled.span`
  margin: 0 !important;
`;

export const PaddingVertically = styled.section`
  padding-bottom: 30px !important;
  padding-top: 30px !important;
`;

export const Paragraph = styled.section`
  text-indent: 4ch;
`;

export const PostDataContainer = styled.section`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  & > :first-child {
    margin-right: 32px !important;
  }
`;

export const PostsContainer = styled.main`
  background-color: #f7f7f7;
  display: block;
  flex-grow: 1;
  margin-top: 72px;
  padding: 16px;
`;

export const Title = styled.h2`
  font-size: 3rem !important;
  font-weight: 400 !important;
  word-break: break-all;
`;

export const VerticallySpaced = styled.hr`
  margin: 32px 0 !important;
`;

export const VioletText = styled.div`
  color: #6435c9 !important;

  * {
    color: #6435c9 !important;
  }
`;
