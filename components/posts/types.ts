import { Post } from "../../store/ducks/posts/types";
import { LoggedId, User } from "../../store/ducks/users/types";

interface StateProps {
  posts: Post[];
  users: User[];
  loggedId: LoggedId;
}

interface DispatchProps {
  add(data: Post[]): void;
  edit(data: Post[]): void;
}

export interface OwnProps {
  showAddPostModal(): void;
}

export interface State {
  likeIconVisibility: boolean;
}

export type Props = StateProps & DispatchProps & OwnProps;
