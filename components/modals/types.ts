export interface MessageState {
  text: string;
  visibility: boolean;
  duration: {
    hide: number;
    show: number;
  };
}
