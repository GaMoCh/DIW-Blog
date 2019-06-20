import { Value } from "slate";

export interface Props {
  placeholder?: string;
}

export interface State {
  value: Value;
}

export type BlockType = "quote" | "listItem" | "orderedList" | "paragraph" | "unorderedList";
export type MarkType =
  | "bold"
  | "italic"
  | "strikethrough"
  | "subscript"
  | "superscript"
  | "underline";
