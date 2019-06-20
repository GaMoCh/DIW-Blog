import { Component, MouseEvent } from "react";
import { Dispatch, bindActionCreators } from "redux";
import { connect } from "react-redux";

import { ApplicationState } from "../../store/index";
import { signOut } from "../../store/ducks/users/actions";
import { Props, State, OwnProps } from "./types";
import {
  MenuItensContainer,
  MenuItensWrapper,
  NoMargin,
  SpacedContainer,
  UserContainer
} from "./styles";

import {
  Button,
  ButtonContent,
  Header,
  Icon,
  IconGroup,
  Image,
  Menu,
  MenuItem,
  Responsive,
  Transition
} from "semantic-ui-react";

class HeaderComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      logoIconVisibility: true
    };

    this.toggleLogoIconVisibility = this.toggleLogoIconVisibility.bind(this);
    this.toggleSidebarVisibility = this.toggleSidebarVisibility.bind(this);
    this.signOutUser = this.signOutUser.bind(this);
    this.showSignInModal = this.showSignInModal.bind(this);
    this.showSignUpModal = this.showSignUpModal.bind(this);
  }

  toggleLogoIconVisibility() {
    this.setState(({ logoIconVisibility }) => ({
      logoIconVisibility: !logoIconVisibility
    }));
  }

  toggleSidebarVisibility(event: MouseEvent) {
    const { toggleSidebarVisibility } = this.props;
    event.preventDefault();
    toggleSidebarVisibility();
  }

  signOutUser(event: MouseEvent) {
    const { signOut } = this.props;
    event.preventDefault();
    signOut(-1);
  }

  showSignInModal(event: MouseEvent) {
    const { showSignInModal } = this.props;
    event.preventDefault();
    showSignInModal();
  }

  showSignUpModal(event: MouseEvent) {
    const { showSignUpModal } = this.props;
    event.preventDefault();
    showSignUpModal();
  }

  render() {
    const { loggedId, users } = this.props;
    const { logoIconVisibility } = this.state;

    const userLogged = loggedId != -1;

    return (
      <Menu inverted as="header" fixed="top">
        <MenuItem header as="a" href="/" onMouseEnter={this.toggleLogoIconVisibility}>
          <Header color="violet" as="h1">
            Blog
          </Header>
          <Transition animation="tada" visible={logoIconVisibility}>
            <IconGroup size="big">
              <Icon color="blue" name="comment outline" />
              <Icon corner inverted color="blue" name="game" />
            </IconGroup>
          </Transition>
        </MenuItem>
        <MenuItensContainer>
          <Responsive as={MenuItensWrapper} minWidth={600}>
            {userLogged ? (
              <SpacedContainer>
                <UserContainer>
                  <Image src={users[loggedId].image} avatar />
                  <Header as={NoMargin} color="violet" size="tiny">
                    {`OLÁ, ${users[loggedId].username}`}
                  </Header>
                </UserContainer>
              </SpacedContainer>
            ) : (
              <SpacedContainer>
                <Button basic animated="fade" color="violet" onClick={this.showSignInModal}>
                  <ButtonContent visible>ENTRAR</ButtonContent>
                  <ButtonContent hidden>
                    <Icon color="blue" name="user" />
                  </ButtonContent>
                </Button>
              </SpacedContainer>
            )}
            <SpacedContainer>
              <Button
                basic
                animated="fade"
                color="violet"
                onClick={userLogged ? this.signOutUser : this.showSignUpModal}
              >
                <ButtonContent visible>{userLogged ? "SAIR" : "CADASTRAR"}</ButtonContent>
                <ButtonContent hidden>
                  <Icon color="blue" name={userLogged ? "user times" : "user plus"} />
                </ButtonContent>
              </Button>
            </SpacedContainer>
          </Responsive>
          <Responsive maxWidth={599} as={MenuItensWrapper}>
            <Button basic circular icon color="violet" onClick={this.toggleSidebarVisibility}>
              <Icon color="blue" name="bars" />
            </Button>
          </Responsive>
        </MenuItensContainer>
      </Menu>
    );
  }
}

const mapStateToProps = ({ users: { data, loggedId } }: ApplicationState) => ({
  users: data,
  loggedId
});

const mapDispatchToProps = (
  dispatch: Dispatch<any>,
  { toggleSidebarVisibility, showSignInModal, showSignUpModal }: OwnProps
) => ({
  ...bindActionCreators({ signOut }, dispatch),
  toggleSidebarVisibility,
  showSignInModal,
  showSignUpModal
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HeaderComponent);
