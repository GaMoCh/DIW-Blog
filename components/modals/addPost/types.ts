import { Post } from "../../../store/ducks/posts/types";
import { LoggedId, User } from "../../../store/ducks/users/types";
import { MessageState } from "../types";

interface StateProps {
  posts: Post[];
  users: User[];
  loggedId: LoggedId;
}

interface DispatchProps {
  add(data: Post[]): void;
}

export interface OwnProps {
  addPostModalVisibility: boolean;
  hideAddPostModal(): void;
}

export interface State {
  titleInput: string;
  imageInput: string;
  message: MessageState;
}

export type Props = StateProps & DispatchProps & OwnProps;
