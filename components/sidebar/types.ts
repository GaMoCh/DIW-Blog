import { LoggedId, User } from "../../store/ducks/users/types";

interface StateProps {
  users: User[];
  loggedId: LoggedId;
}

interface DispatchProps {
  signOut(loggedId: LoggedId): void;
}

export interface OwnProps {
  sidebarVisibility: boolean;
  showSignInModal(): void;
  showSignUpModal(): void;
  hideSidebar(): void;
}

export interface State {}

export type Props = StateProps & DispatchProps & OwnProps;
