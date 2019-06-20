import { LoggedId, User } from "../../../store/ducks/users/types";
import { MessageState } from "../types";

interface StateProps {
  users: User[];
}

interface DispatchProps {
  signIn(loggedId: LoggedId): void;
}

export interface OwnProps {
  signInModalVisibility: boolean;
  hideSignInModal(): void;
}

export interface State {
  usernameInput: string;
  passwordInput: string;
  passwordInputVisibility: boolean;
  message: MessageState;
}

export type Props = StateProps & DispatchProps & OwnProps;
