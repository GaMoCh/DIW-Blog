import { UsersState } from "./types";

const initialState: UsersState = {
  data: [
    {
      username: "ADMIN",
      password: "admin",
      isWriter: true,
      image: "https://api.adorable.io/avatars/40/admin"
    },
    {
      username: "GABRIEL",
      password: "senha123",
      isWriter: true,
      image: "https://api.adorable.io/avatars/40/gabriel"
    }
  ],
  loggedId: -1
};

export default initialState;
