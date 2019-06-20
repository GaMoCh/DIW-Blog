import { User } from "../users/types";

/**
 * Action types
 */
export enum PostsTypes {
  ADD = "@posts/ADD",
  EDIT = "@posts/EDIT",
  REMOVE = "@posts/REMOVE",
  LIKE = "@posts/LIKE",
  UNLIKE = "@posts/UNLIKE"
}

/**
 * Data types
 */
export interface comment {
  author: User;
  date: string;
  text: string;
}

export interface Post {
  title: string;
  author: User;
  date: string;
  image: string;
  text: string;
  likes: {
    amount: number;
    users: string[];
  };
  comments: comment[];
}

/**
 * State type
 */
export interface PostsState {
  readonly data: Post[];
}
