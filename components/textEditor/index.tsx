import { Component, MouseEvent } from "react";
import { Editor as CoreEditor, Block, Mark, Node, Value } from "slate";
import { Editor, getEventTransfer, RenderBlockProps, RenderMarkProps } from "slate-react";
import Html, { Rule } from "slate-html-serializer";

import { Props, State, BlockType, MarkType } from "./types";
import { UnstyledPopup } from "./styles";

import { Button, ButtonGroup, Icon, Popup, PopupContent, SemanticICONS } from "semantic-ui-react";

const DEFAULT_NODE = "paragraph";

const BLOCK_TAGS: { [key: string]: BlockType } = {
  blockquote: "quote",
  li: "listItem",
  ol: "orderedList",
  p: "paragraph",
  ul: "unorderedList"
};

const MARK_TAGS: { [key: string]: MarkType } = {
  b: "bold",
  i: "italic",
  s: "strikethrough",
  sub: "subscript",
  sup: "superscript",
  u: "underline"
};

const rules: Rule[] = [
  {
    deserialize(
      element: Element,
      next: (elements: Element[] | NodeList | Array<Node & ChildNode>) => any
    ) {
      const type = BLOCK_TAGS[element.tagName.toLowerCase()];

      if (type) {
        return {
          object: "block",
          type: type,
          data: {
            className: element.getAttribute("class")
          },
          nodes: next(element.childNodes)
        };
      }
    },
    serialize(object: any, children: string) {
      if (object.object === "block") {
        switch (object.type as BlockType) {
          case "quote":
            return <blockquote>{children}</blockquote>;
          case "listItem":
            return <li>{children}</li>;
          case "orderedList":
            return <ol>{children}</ol>;
          case "paragraph":
            return <p className={object.data.get("className")}>{children}</p>;
          case "unorderedList":
            return <ul>{children}</ul>;
        }
      }
    }
  },
  {
    deserialize(
      element: Element,
      next: (elements: Element[] | NodeList | Array<Node & ChildNode>) => any
    ) {
      const type = MARK_TAGS[element.tagName.toLowerCase()];

      if (type) {
        return {
          object: "mark",
          type: type,
          nodes: next(element.childNodes)
        };
      }
    },
    serialize(object: any, children: string) {
      if (object.object === "mark") {
        switch (object.type as MarkType) {
          case "bold":
            return <b>{children}</b>;
          case "italic":
            return <i>{children}</i>;
          case "strikethrough":
            return <s>{children}</s>;
          case "subscript":
            return <sub>{children}</sub>;
          case "superscript":
            return <sup>{children}</sup>;
          case "underline":
            return <u>{children}</u>;
        }
      }
    }
  }
];

const serializer = new Html({ rules });
const initialValue = "<p></p>";

class TextEditorComponent extends Component<Props, State> {
  editor: Editor;

  constructor(props: Props) {
    super(props);

    this.state = {
      value: serializer.deserialize(initialValue)
    };

    this.editor = new Editor({ value: this.state.value });

    this.getRef = this.getRef.bind(this);
    this.clearValue = this.clearValue.bind(this);
    this.getHTMLCode = this.getHTMLCode.bind(this);
    this.hasBlock = this.hasBlock.bind(this);
    this.hasMark = this.hasMark.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onPaste = this.onPaste.bind(this);
    this.onClickBlock = this.onClickBlock.bind(this);
    this.onClickMark = this.onClickMark.bind(this);
    this.renderBlock = this.renderBlock.bind(this);
    this.renderMark = this.renderMark.bind(this);
    this.renderBlockButton = this.renderBlockButton.bind(this);
    this.renderMarkButton = this.renderMarkButton.bind(this);
  }

  getRef(editor: Editor) {
    this.editor = editor;
  }

  clearValue() {
    this.setState({
      value: serializer.deserialize(initialValue)
    });
  }

  getHTMLCode() {
    return serializer.serialize(this.state.value);
  }

  hasBlock(type: BlockType) {
    const { value } = this.state;
    return value.blocks.some(node => (node as Block).type === type);
  }

  hasMark(type: MarkType) {
    const { value } = this.state;
    return value.activeMarks.some(mark => (mark as Mark).type === type);
  }

  onChange({ value }: { value: Value }) {
    this.setState({ value });
  }

  onKeyDown(event: Event, editor: CoreEditor, next: Function) {
    if (!(event as KeyboardEvent).ctrlKey) {
      return next();
    }

    let mark: MarkType;

    switch ((event as KeyboardEvent).key) {
      case "b":
        mark = "bold";
        break;
      case "i":
        mark = "italic";
        break;
      case "s":
        mark = "strikethrough";
        break;
      case "[":
        mark = "subscript";
        break;
      case "]":
        mark = "superscript";
        break;
      case "u":
        mark = "underline";
        break;
      default:
        return next();
    }

    event.preventDefault();
    editor.toggleMark(mark);
  }

  onPaste(event: Event, editor: CoreEditor, next: Function) {
    const transfer = getEventTransfer(event);
    if (transfer.type !== "html") return next();
    const { document } = serializer.deserialize((transfer as any).html);
    editor.insertFragment(document);
  }

  onClickBlock(event: MouseEvent, type: BlockType) {
    event.preventDefault();

    const { editor } = this;
    const { value } = editor;
    const { document } = value;

    if (type !== "unorderedList" && type !== "orderedList") {
      const isActive = this.hasBlock(type);
      const isList = this.hasBlock("listItem");

      if (isList) {
        editor
          .setBlocks(isActive ? DEFAULT_NODE : type)
          .unwrapBlock("unorderedList")
          .unwrapBlock("orderedList");
      } else {
        editor.setBlocks(isActive ? DEFAULT_NODE : type);
      }
    } else {
      const isList = this.hasBlock("listItem");
      const isType = value.blocks.some(block => {
        return !!document.getClosest(
          (block as Block).key,
          parent => (parent as Block).type === type
        );
      });

      if (isList && isType) {
        editor
          .setBlocks(DEFAULT_NODE)
          .unwrapBlock("unorderedList")
          .unwrapBlock("orderedList");
      } else if (isList) {
        editor
          .unwrapBlock(type === "unorderedList" ? "orderedList" : "unorderedList")
          .wrapBlock(type);
      } else {
        editor.setBlocks("listItem").wrapBlock(type);
      }
    }
  }

  onClickMark(event: MouseEvent, type: MarkType) {
    event.preventDefault();
    this.editor.toggleMark(type);
  }

  renderBlock(props: RenderBlockProps, _editor: CoreEditor, next: Function) {
    const { attributes, children, node } = props;

    switch (node.type as BlockType) {
      case "quote":
        return <blockquote {...attributes}>{children}</blockquote>;
      case "listItem":
        return <li {...attributes}>{children}</li>;
      case "orderedList":
        return <ol {...attributes}>{children}</ol>;
      case "paragraph":
        return (
          <p {...attributes} className={node.data.get("className")}>
            {children}
          </p>
        );
      case "unorderedList":
        return <ul {...attributes}>{children}</ul>;
      default:
        return next();
    }
  }

  renderMark(props: RenderMarkProps, _editor: CoreEditor, next: Function) {
    const { mark, attributes } = props;

    switch (mark.type as MarkType) {
      case "bold":
        return <b {...attributes}>{props.children}</b>;
      case "italic":
        return <i {...attributes}>{props.children}</i>;
      case "strikethrough":
        return <s {...attributes}>{props.children}</s>;
      case "subscript":
        return <sub {...attributes}>{props.children}</sub>;
      case "superscript":
        return <sup {...attributes}>{props.children}</sup>;
      case "underline":
        return <u {...attributes}>{props.children}</u>;
      default:
        return next();
    }
  }

  renderBlockButton(type: BlockType, icon: SemanticICONS) {
    let isActive = this.hasBlock(type);

    if (["orderedList", "unorderedList"].includes(type)) {
      const {
        value: { document, blocks }
      } = this.state;

      if (blocks.size > 0) {
        const parent = document.getParent(blocks.first().key);
        isActive = (this.hasBlock("listItem") && parent && (parent as Block).type) === type;
      }
    }

    return (
      <Button
        active={isActive}
        icon
        onMouseDown={(event: MouseEvent) => this.onClickBlock(event, type)}
      >
        <Icon name={icon} />
      </Button>
    );
  }

  renderMarkButton(type: MarkType, icon: SemanticICONS) {
    const isActive = this.hasMark(type);

    return (
      <Button
        active={isActive}
        icon
        onMouseDown={(event: MouseEvent) => this.onClickMark(event, type)}
      >
        <Icon name={icon} />
      </Button>
    );
  }

  render() {
    const { placeholder } = this.props;

    return (
      <Popup
        as={UnstyledPopup}
        basic
        hideOnScroll
        offset="25px, 8px"
        position="top right"
        size="mini"
        trigger={
          <Editor
            ref={this.getRef}
            value={this.state.value}
            onChange={this.onChange}
            onKeyDown={this.onKeyDown}
            onPaste={this.onPaste}
            renderBlock={this.renderBlock}
            renderMark={this.renderMark}
            placeholder={placeholder}
          />
        }
      >
        <PopupContent>
          <ButtonGroup size="mini">
            {this.renderMarkButton("bold", "bold")}
            {this.renderMarkButton("italic", "italic")}
            {this.renderMarkButton("underline", "underline")}
            {this.renderMarkButton("strikethrough", "strikethrough")}
            {this.renderMarkButton("subscript", "subscript")}
            {this.renderMarkButton("superscript", "superscript")}
            {/* {this.renderBlockButton("quote", "quote left")}
            {this.renderBlockButton("unorderedList", "list ul")}
            {this.renderBlockButton("orderedList", "list ol")} */}
          </ButtonGroup>
        </PopupContent>
      </Popup>
    );
  }
}

export default TextEditorComponent;
