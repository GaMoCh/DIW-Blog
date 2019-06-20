/**
 * Action types
 */
export enum UsersTypes {
  ADD = "@users/ADD",
  EDIT = "@users/EDIT",
  REMOVE = "@users/REMOVE",
  SIGNIN = "@users/SIGNIN",
  SIGNOUT = "@users/SIGNOUT"
}

/**
 * Data types
 */
export type LoggedId = number;

export interface User {
  username: string;
  password?: string;
  isWriter?: boolean;
  image: string;
}

/**
 * State type
 */
export interface UsersState {
  readonly data: User[];
  readonly loggedId: LoggedId;
}
