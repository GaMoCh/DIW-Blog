import styled from "styled-components";

export const AlignedInEnd = styled.section`
  align-self: flex-end;
`;

export const ImageViewContainer = styled.div`
  height: 83px;
  margin-bottom: 14px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const InputFile = styled.input`
  display: none;
`;

export const IsWriterCheckboxContainer = styled.section`
  text-align: center;

  @media (max-width: 766px) {
    margin-top: 14px !important;
  }
`;

export const MaximumSize = styled.div`
  flex-grow: 1 !important;
`;

export const MessageContainer = styled.section`
  margin-bottom: 21px;
  text-align: center;
`;

export const VioletInput = styled.input`
  :focus {
    border-color: #a291fb !important;
    caret-color: #a291fb;
  }
`;

export const VioletCheckbox = styled.div`
  &.ui.toggle.checkbox input:checked ~ label::before {
    background-color: #a291fb !important;
  }
`;
