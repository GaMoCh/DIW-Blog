import { action } from "typesafe-actions";

import { PostsTypes, Post } from "./types";

export const add = (data: Post[]) => action(PostsTypes.ADD, { data });

export const edit = (data: Post[]) => action(PostsTypes.EDIT, { data });

export const remove = (data: Post[]) => action(PostsTypes.REMOVE, { data });

export const like = (data: Post[]) => action(PostsTypes.LIKE, { data });

export const unlike = (data: Post[]) => action(PostsTypes.UNLIKE, { data });
