import { LoggedId, User } from "../../store/ducks/users/types";

interface StateProps {
  users: User[];
  loggedId: LoggedId;
}

interface DispatchProps {
  signOut(loggedId: LoggedId): void;
}

export interface OwnProps {
  toggleSidebarVisibility(): void;
  showSignInModal(): void;
  showSignUpModal(): void;
}

export interface State {
  logoIconVisibility: boolean;
}

export type Props = StateProps & DispatchProps & OwnProps;
