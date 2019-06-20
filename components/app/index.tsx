import { Component, SyntheticEvent } from "react";

import SidebarComponent from "../sidebar";
import HeaderComponent from "../header";
import PostsComponent from "../posts";
import AddPostComponent from "../modals/addPost";
import SignInComponent from "../modals/signIn";
import SignUpComponent from "../modals/signUp";
import FooterComponent from "../footer";

import { Props, State } from "./types";
import { FlexCollumn, FullHeight } from "./styles";

import { SidebarPushable, SidebarPusher, Responsive } from "semantic-ui-react";

class AppComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      sidebarVisibility: false,
      addPostModalVisibility: false,
      signInModalVisibility: false,
      signUpModalVisibility: false
    };

    this.handleAppResize = this.handleAppResize.bind(this);
    this.toggleSidebarVisibility = this.toggleSidebarVisibility.bind(this);
    this.showAddPostModal = this.showAddPostModal.bind(this);
    this.showSignInModal = this.showSignInModal.bind(this);
    this.showSignUpModal = this.showSignUpModal.bind(this);
    this.hideSidebar = this.hideSidebar.bind(this);
    this.hideAddPostModal = this.hideAddPostModal.bind(this);
    this.hideSignInModal = this.hideSignInModal.bind(this);
    this.hideSignUpModal = this.hideSignUpModal.bind(this);
  }

  handleAppResize({ target }: SyntheticEvent) {
    const { innerWidth: width } = target as Window;

    if (width >= 600) {
      this.hideSidebar();
    }
  }

  toggleSidebarVisibility() {
    this.setState(({ sidebarVisibility }) => ({
      sidebarVisibility: !sidebarVisibility
    }));
  }

  showAddPostModal() {
    this.setState({
      addPostModalVisibility: true
    });
  }

  showSignInModal() {
    this.setState({
      signInModalVisibility: true
    });
  }

  showSignUpModal() {
    this.setState({
      signUpModalVisibility: true
    });
  }

  hideSidebar() {
    this.setState({
      sidebarVisibility: false
    });
  }

  hideAddPostModal() {
    this.setState({
      addPostModalVisibility: false
    });
  }

  hideSignInModal() {
    this.setState({
      signInModalVisibility: false
    });
  }

  hideSignUpModal() {
    this.setState({
      signUpModalVisibility: false
    });
  }

  render() {
    const {
      addPostModalVisibility,
      sidebarVisibility,
      signInModalVisibility,
      signUpModalVisibility
    } = this.state;

    return (
      <Responsive as={FullHeight} onUpdate={this.handleAppResize}>
        <SidebarPushable as="section">
          <SidebarComponent
            sidebarVisibility={sidebarVisibility}
            showSignInModal={this.showSignInModal}
            showSignUpModal={this.showSignUpModal}
            hideSidebar={this.hideSidebar}
          />
          <SidebarPusher as={FlexCollumn}>
            <HeaderComponent
              toggleSidebarVisibility={this.toggleSidebarVisibility}
              showSignInModal={this.showSignInModal}
              showSignUpModal={this.showSignUpModal}
            />
            <PostsComponent showAddPostModal={this.showAddPostModal} />
            <FooterComponent />
          </SidebarPusher>
        </SidebarPushable>
        <AddPostComponent
          addPostModalVisibility={addPostModalVisibility}
          hideAddPostModal={this.hideAddPostModal}
        />
        <SignInComponent
          signInModalVisibility={signInModalVisibility}
          hideSignInModal={this.hideSignInModal}
        />
        <SignUpComponent
          signUpModalVisibility={signUpModalVisibility}
          hideSignUpModal={this.hideSignUpModal}
        />
      </Responsive>
    );
  }
}

export default AppComponent;
