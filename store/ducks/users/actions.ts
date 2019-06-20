import { action } from "typesafe-actions";

import { LoggedId, User, UsersTypes } from "./types";

export const add = (data: User[]) => action(UsersTypes.ADD, { data });

export const edit = (data: User[]) => action(UsersTypes.EDIT, { data });

export const remove = (data: User[]) => action(UsersTypes.REMOVE, { data });

export const signIn = (loggedId: LoggedId) => action(UsersTypes.SIGNIN, { loggedId });

export const signOut = (loggedId: LoggedId) => action(UsersTypes.SIGNOUT, { loggedId });
