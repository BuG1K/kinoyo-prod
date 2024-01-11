import { Reducer } from "react";
import { UserActions, ActionsType, UserInitialState } from "./types";

const userInitialState: UserInitialState = {
  name: "",
  lastCheckNotifications: new Date("05.03.1999"),
};

const userReducer: Reducer<UserInitialState, UserActions> = (
  state,
  { type, payload },
) => {
  if (type === ActionsType.USER_FETCH) {
    return payload;
  }

  return state;
};

export { userInitialState, userReducer };
