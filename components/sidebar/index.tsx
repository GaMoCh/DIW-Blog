import { Component, MouseEvent } from "react";
import { Dispatch, bindActionCreators } from "redux";
import { connect } from "react-redux";

import { ApplicationState } from "../../store/index";
import { signOut } from "../../store/ducks/users/actions";
import { Props, State, OwnProps } from "./types";
import { FloatInRight, ImageIcon, LogoContainer, WordBreaked } from "./styles";

import { Sidebar, Menu, MenuItem, Icon, Image, Header, IconGroup } from "semantic-ui-react";

class SidebarComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.signOutUser = this.signOutUser.bind(this);
    this.showSignInModal = this.showSignInModal.bind(this);
    this.showSignUpModal = this.showSignUpModal.bind(this);
  }

  signOutUser(event: MouseEvent) {
    const { hideSidebar, signOut } = this.props;
    event.preventDefault();
    hideSidebar();
    signOut(-1);
  }

  showSignInModal(event: MouseEvent) {
    const { hideSidebar, showSignInModal } = this.props;
    event.preventDefault();
    hideSidebar();
    showSignInModal();
  }

  showSignUpModal(event: MouseEvent) {
    const { hideSidebar, showSignUpModal } = this.props;
    event.preventDefault();
    hideSidebar();
    showSignUpModal();
  }

  render() {
    const { loggedId, sidebarVisibility, users } = this.props;

    const userLogged = loggedId != -1;

    return (
      <Sidebar
        as={Menu}
        animation="slide along"
        direction="right"
        inverted
        vertical
        visible={sidebarVisibility}
      >
        <MenuItem onClick={userLogged ? undefined : this.showSignInModal}>
          {userLogged ? null : <Icon color="blue" name="user" size="large" />}
          <Header as={WordBreaked} color="violet">
            {userLogged ? `OLÁ, ${users[loggedId].username}` : "ENTRAR"}
          </Header>
          {userLogged ? (
            <FloatInRight>
              <Image as={ImageIcon} src={users[loggedId].image} avatar size="mini" />
            </FloatInRight>
          ) : null}
        </MenuItem>
        <MenuItem onClick={userLogged ? this.signOutUser : this.showSignUpModal}>
          <Icon color="blue" name={userLogged ? "user times" : "user plus"} size="large" />
          <Header as={WordBreaked} color="violet">
            {userLogged ? "SAIR" : "CADASTRAR"}
          </Header>
        </MenuItem>
        <LogoContainer>
          <IconGroup size="massive">
            <Icon color="blue" name="comment outline" />
            <Icon corner inverted color="blue" name="game" />
          </IconGroup>
        </LogoContainer>
      </Sidebar>
    );
  }
}

const mapStateToProps = (
  { users: { data, loggedId } }: ApplicationState,
  { sidebarVisibility }: OwnProps
) => ({
  users: data,
  loggedId,
  sidebarVisibility
});

const mapDispatchToProps = (
  dispatch: Dispatch<any>,
  { showSignInModal, showSignUpModal, hideSidebar }: OwnProps
) => ({
  ...bindActionCreators({ signOut }, dispatch),
  showSignInModal,
  showSignUpModal,
  hideSidebar
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SidebarComponent);
