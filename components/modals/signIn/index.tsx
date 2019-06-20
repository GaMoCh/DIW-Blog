import { Component, ChangeEvent } from "react";
import { Dispatch, bindActionCreators } from "redux";
import { connect } from "react-redux";

import { ApplicationState } from "../../../store/index";
import { signIn } from "../../../store/ducks/users/actions";
import { Props, State, OwnProps } from "./types";
import { AlignedInEnd, MaximumSize, MessageContainer, VioletInput } from "../styles";

import {
  Modal,
  ModalHeader,
  ModalContent,
  ModalActions,
  Button,
  Header,
  Form,
  FormField,
  Icon,
  ModalDescription,
  Transition,
  FormGroup
} from "semantic-ui-react";

const initialState = {
  usernameInput: "ADMIN",
  passwordInput: "admin",
  passwordInputVisibility: false,
  message: {
    text: "",
    visibility: false,
    duration: {
      hide: 500,
      show: 500
    }
  }
};

class SignInComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = initialState;

    this.handleUsernameInputChange = this.handleUsernameInputChange.bind(this);
    this.handlePasswordInputChange = this.handlePasswordInputChange.bind(this);
    this.togglePasswordInputVisibility = this.togglePasswordInputVisibility.bind(this);
    this.showMessage = this.showMessage.bind(this);
    this.hideMessage = this.hideMessage.bind(this);
    this.handleHideSignInModal = this.handleHideSignInModal.bind(this);
    this.signInUser = this.signInUser.bind(this);
  }

  handleUsernameInputChange({ target }: ChangeEvent) {
    const { value } = target as HTMLInputElement;

    if (value.length <= 12) {
      this.setState({
        usernameInput: value.toUpperCase()
      });
    }
  }

  handlePasswordInputChange({ target }: ChangeEvent) {
    const { value } = target as HTMLInputElement;

    if (value.length <= 16) {
      this.setState({
        passwordInput: value
      });
    }
  }

  togglePasswordInputVisibility() {
    this.setState(({ passwordInputVisibility }) => ({
      passwordInputVisibility: !passwordInputVisibility
    }));
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

  handleHideSignInModal() {
    const { hideSignInModal } = this.props;

    this.hideMessage();
    this.setState(initialState);

    hideSignInModal();
  }

  signInUser() {
    const { signIn, users } = this.props;
    const { usernameInput, passwordInput } = this.state;
    const loggedId = users.findIndex(({ username }) => username === usernameInput);

    if (!usernameInput || !passwordInput) {
      if (!usernameInput && !passwordInput) {
        this.showMessage("Nome de usuário e senha não informados");
      } else if (!usernameInput) {
        this.showMessage("Nome de usuário não informado");
      } else if (!passwordInput) {
        this.showMessage("Senha não informada");
      }
    } else if (loggedId != -1) {
      if (users[loggedId].password === passwordInput) {
        signIn(loggedId);
        this.handleHideSignInModal();
      } else {
        this.showMessage("Senha incorreta");
      }
    } else {
      this.showMessage("Usuário não encontrado");
    }
  }

  render() {
    const { signInModalVisibility } = this.props;
    const {
      usernameInput,
      passwordInput,
      passwordInputVisibility,
      message: { text: messageText, visibility: messageVisibility, duration: messageDuraction }
    } = this.state;

    return (
      <Modal closeIcon dimmer onClose={this.handleHideSignInModal} open={signInModalVisibility}>
        <ModalHeader>
          <Header color="violet">Entrar</Header>
        </ModalHeader>
        <ModalContent>
          <Form>
            <FormField>
              <Header as="label" color="violet">
                Nome de usuário ou e-mail
              </Header>
              <VioletInput
                type="text"
                autoComplete="username"
                value={usernameInput}
                onChange={this.handleUsernameInputChange}
              />
            </FormField>
            <FormGroup>
              <FormField as={MaximumSize}>
                <Header as="label" color="violet">
                  Senha
                </Header>
                <VioletInput
                  type={passwordInputVisibility ? "text" : "password"}
                  autoComplete="new-password"
                  value={passwordInput}
                  onChange={this.handlePasswordInputChange}
                />
              </FormField>
              <FormField as={AlignedInEnd}>
                <Button circular icon onClick={this.togglePasswordInputVisibility}>
                  <Icon color="violet" name={passwordInputVisibility ? "eye slash" : "eye"} />
                </Button>
              </FormField>
            </FormGroup>
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
          <Button color="violet" onClick={this.signInUser}>
            <Icon name="user" />
            Entrar
          </Button>
        </ModalActions>
      </Modal>
    );
  }
}

const mapStateToProps = (
  { users: { data } }: ApplicationState,
  { signInModalVisibility }: OwnProps
) => ({
  users: data,
  signInModalVisibility
});

const mapDispatchToProps = (dispatch: Dispatch<any>, { hideSignInModal }: OwnProps) => ({
  ...bindActionCreators({ signIn }, dispatch),
  hideSignInModal
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignInComponent);
