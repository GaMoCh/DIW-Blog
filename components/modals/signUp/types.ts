import { LoggedId, User } from "../../../store/ducks/users/types";
import { MessageState } from "../types";

interface StateProps {
  users: User[];
}

interface DispatchProps {
  add(data: User[]): void;
  signIn(loggedId: LoggedId): void;
}

export interface OwnProps {
  signUpModalVisibility: boolean;
  hideSignUpModal(): void;
}

export interface State {
  usernameInput: string;
  passwordInput: string;
  isWriterInput: boolean;
  passwordInputVisibility: boolean;
  message: MessageState;
}

export type Props = StateProps & DispatchProps & OwnProps;
