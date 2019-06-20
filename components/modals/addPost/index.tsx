import { Component, createRef, ChangeEvent } from "react";
import { Dispatch, bindActionCreators } from "redux";
import { connect } from "react-redux";

import TextEditorComponent from "../../textEditor";

import { ApplicationState } from "../../../store/index";
import { add } from "../../../store/ducks/posts/actions";
import { Props, State, OwnProps } from "./types";
import { ImageViewContainer, InputFile, MessageContainer, VioletInput } from "../styles";

import {
  Button,
  Form,
  FormField,
  Header,
  Icon,
  Image,
  Modal,
  ModalActions,
  ModalContent,
  ModalDescription,
  ModalHeader,
  Transition,
  Segment,
  ButtonContent
} from "semantic-ui-react";

const initialState = {
  titleInput: "",
  imageInput: "",
  message: {
    text: "",
    visibility: false,
    duration: {
      hide: 500,
      show: 500
    }
  }
};

class AddPostComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = initialState;

    this.readUploadedFileAsDataURL = this.readUploadedFileAsDataURL.bind(this);
    this.handleTitleInputChange = this.handleTitleInputChange.bind(this);
    this.handleImageInputChange = this.handleImageInputChange.bind(this);
    this.handleHideAddPostModal = this.handleHideAddPostModal.bind(this);
    this.showMessage = this.showMessage.bind(this);
    this.hideMessage = this.hideMessage.bind(this);
    this.addPost = this.addPost.bind(this);
  }

  private textEditorComponentRef = createRef<TextEditorComponent>();

  readUploadedFileAsDataURL(inputFile: File) {
    const temporaryFileReader = new FileReader();

    return new Promise((resolve, reject) => {
      temporaryFileReader.onerror = () => {
        temporaryFileReader.abort();
        reject(new DOMException("Problem parsing input file."));
      };

      temporaryFileReader.onload = () => {
        resolve(temporaryFileReader.result);
      };

      temporaryFileReader.readAsDataURL(inputFile);
    });
  }

  handleTitleInputChange({ target }: ChangeEvent) {
    const { value } = target as HTMLInputElement;

    if (value.length <= 128) {
      this.setState({
        titleInput: value
      });
    }
  }

  async handleImageInputChange(event: ChangeEvent) {
    event.persist();

    if (!event.target || !(event.target as HTMLInputElement).files) {
      return;
    } else {
      const file: File = ((event.target as HTMLInputElement).files as FileList)[0];

      try {
        const imageDataURL = await this.readUploadedFileAsDataURL(file);
        this.setState({
          imageInput: imageDataURL as string
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  handleHideAddPostModal() {
    const { hideAddPostModal } = this.props;

    this.setState(initialState);

    hideAddPostModal();
  }

  showMessage(newsMessageText: string) {
    const {
      message,
      message: {
        text: messageText,
        duration: { hide: messageHideDuration }
      }
    } = this.state;
    const messageTextChanged = newsMessageText !== messageText;
    const delay = messageTextChanged ? messageHideDuration : 0;

    if (messageTextChanged) {
      this.hideMessage();
    }

    setTimeout(() => {
      this.setState({
        message: {
          ...message,
          visibility: true,
          text: newsMessageText || messageText
        }
      });
    }, delay);
  }

  hideMessage() {
    const { message } = this.state;

    this.setState({
      message: {
        ...message,
        visibility: false
      }
    });
  }

  addPost() {
    const { add, loggedId, posts, users } = this.props;
    const { titleInput, imageInput } = this.state;
    const textInput = (this.textEditorComponentRef.current as TextEditorComponent).getHTMLCode();
    const loggedUser = (({ username, image }) => ({ username, image }))(users[loggedId]);

    if (!titleInput || !imageInput || !textInput) {
      if (!titleInput) {
        this.showMessage("Título não informado");
      } else if (!imageInput) {
        this.showMessage("Imagem não adicionada");
      } else if (!textInput) {
        this.showMessage("Texto não inserido");
      }
    } else {
      posts.push({
        title: titleInput,
        author: loggedUser,
        date: new Date().toString(),
        image: imageInput,
        text: textInput,
        likes: {
          amount: 0,
          users: []
        },
        comments: []
      });

      add(posts);
      location.reload();
      this.handleHideAddPostModal();
    }
  }

  render() {
    const { addPostModalVisibility } = this.props;
    const {
      titleInput,
      imageInput,
      message: { text: messageText, visibility: messageVisibility, duration: messageDuraction }
    } = this.state;

    return (
      <Modal closeIcon dimmer onClose={this.handleHideAddPostModal} open={addPostModalVisibility}>
        <ModalHeader>
          <Header color="violet">Adicionar Postagem</Header>
        </ModalHeader>
        <ModalContent>
          <Form>
            <FormField>
              <Header as="label" color="violet">
                Título da postagem
              </Header>
              <VioletInput type="text" value={titleInput} onChange={this.handleTitleInputChange} />
            </FormField>
            <Segment placeholder>
              {imageInput ? (
                <ImageViewContainer>
                  <Image centered rounded size="tiny" src={imageInput} />
                </ImageViewContainer>
              ) : (
                <Header icon>
                  <Icon name="images outline" />
                  Nenhuma imagem selecionada
                </Header>
              )}
              <InputFile
                id="inputFile"
                type="file"
                accept="image/*"
                onChange={this.handleImageInputChange}
              />
              <Button as="label" animated="vertical" color="blue" htmlFor="inputFile">
                <ButtonContent visible>
                  {imageInput ? "Alterar Imagem" : "Adicionar Imagem"}
                </ButtonContent>
                <ButtonContent hidden>
                  <Icon name="image outline" />
                </ButtonContent>
              </Button>
            </Segment>
            <Header as="label" color="violet">
              Texto da postagem
            </Header>
            <Segment>
              <TextEditorComponent
                ref={this.textEditorComponentRef}
                placeholder="Insira o conteúdo do texto"
              />
            </Segment>
          </Form>
        </ModalContent>
        <ModalDescription>
          <Transition animation="scale" duration={messageDuraction} visible={messageVisibility}>
            <MessageContainer>
              <Header as="span" color="red">
                {messageText}
              </Header>
            </MessageContainer>
          </Transition>
        </ModalDescription>
        <ModalActions>
          <Button color="violet" onClick={this.addPost}>
            <Icon name="plus circle" />
            Adicionar
          </Button>
        </ModalActions>
      </Modal>
    );
  }
}

const mapStateToProps = (
  { posts, users }: ApplicationState,
  { addPostModalVisibility }: OwnProps
) => ({
  posts: posts.data,
  users: users.data,
  loggedId: users.loggedId,
  addPostModalVisibility
});

const mapDispatchToProps = (dispatch: Dispatch<any>, { hideAddPostModal }: OwnProps) => ({
  ...bindActionCreators({ add }, dispatch),
  hideAddPostModal
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddPostComponent);
