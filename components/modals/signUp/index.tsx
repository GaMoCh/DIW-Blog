import { Component, ChangeEvent, FormEvent } from "react";
import { Dispatch, bindActionCreators } from "redux";
import { connect } from "react-redux";

import { ApplicationState } from "../../../store/index";
import { add, signIn } from "../../../store/ducks/users/actions";
import { Props, State, OwnProps } from "./types";
import {
  IsWriterCheckboxContainer,
  MessageContainer,
  VioletInput,
  VioletCheckbox,
  MaximumSize,
  AlignedInEnd
} from "../styles";

import {
  Button,
  Checkbox,
  CheckboxProps,
  Form,
  FormField,
  Header,
  Icon,
  Modal,
  ModalActions,
  ModalContent,
  ModalDescription,
  ModalHeader,
  Transition,
  FormGroup
} from "semantic-ui-react";

const initialState = {
  usernameInput: "",
  passwordInput: "",
  isWriterInput: false,
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

class SignUpComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = initialState;

    this.handleUsernameInputChange = this.handleUsernameInputChange.bind(this);
    this.handlePasswordInputChange = this.handlePasswordInputChange.bind(this);
    this.handleIsWriterInputChange = this.handleIsWriterInputChange.bind(this);
    this.togglePasswordInputVisibility = this.togglePasswordInputVisibility.bind(this);
    this.showMessage = this.showMessage.bind(this);
    this.hideMessage = this.hideMessage.bind(this);
    this.handleHideSignUpModal = this.handleHideSignUpModal.bind(this);
    this.signUpUser = this.signUpUser.bind(this);
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

  handleIsWriterInputChange(event: FormEvent, { checked }: CheckboxProps) {
    event.preventDefault();
    this.setState({
      isWriterInput: checked as boolean
    });
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

  handleHideSignUpModal() {
    const { hideSignUpModal } = this.props;

    this.hideMessage();
    this.setState(initialState);

    hideSignUpModal();
  }

  signUpUser() {
    const { add, signIn, users } = this.props;
    const { usernameInput, passwordInput, isWriterInput } = this.state;
    const userExists = users.findIndex(({ username }) => username === usernameInput) !== -1;

    if (!usernameInput || !passwordInput) {
      if (!usernameInput && !passwordInput) {
        this.showMessage("Nome de usuário e senha não informados");
      } else if (!usernameInput) {
        this.showMessage("Nome de usuário não informado");
      } else if (!passwordInput) {
        this.showMessage("Senha não informada");
      }
    } else if (userExists) {
      this.showMessage("Nome de usuário já está sendo utilizado");
    } else {
      add([
        ...users,
        {
          username: usernameInput,
          password: passwordInput,
          isWriter: isWriterInput,
          image: `https://api.adorable.io/avatars/40/${usernameInput.toLocaleLowerCase()}`
        }
      ]);
      signIn(users.length);
      this.handleHideSignUpModal();
    }
  }

  render() {
    const { signUpModalVisibility } = this.props;
    const {
      usernameInput,
      passwordInput,
      passwordInputVisibility,
      message: { text: messageText, visibility: messageVisibility, duration: messageDuraction }
    } = this.state;

    return (
      <Modal closeIcon dimmer onClose={this.handleHideSignUpModal} open={signUpModalVisibility}>
        <ModalHeader>
          <Header color="violet">Cadastrar</Header>
        </ModalHeader>
        <ModalContent>
          <Form>
            <FormField>
              <Header as="label" color="violet">
                Nome de usuário
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
            <FormField as={IsWriterCheckboxContainer}>
              <Header as="label" color="violet">
                Criar conta de escritor?
              </Header>
              <Checkbox as={VioletCheckbox} toggle onChange={this.handleIsWriterInputChange} />
            </FormField>
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
          <Button color="violet" onClick={this.signUpUser}>
            <Icon name="user plus" />
            Cadastrar
          </Button>
        </ModalActions>
      </Modal>
    );
  }
}

const mapStateToProps = (
  { users: { data } }: ApplicationState,
  { signUpModalVisibility }: OwnProps
) => ({
  users: data,
  signUpModalVisibility
});

const mapDispatchToProps = (dispatch: Dispatch<any>, { hideSignUpModal }: OwnProps) => ({
  ...bindActionCreators({ add, signIn }, dispatch),
  hideSignUpModal
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUpComponent);
