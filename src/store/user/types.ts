import { UserType } from "@/types";

interface UserInitialState extends UserType {}

enum ActionsType {
  USER_FETCH = "USER_FETCH"
}

interface UserActionFetch {
  type: ActionsType.USER_FETCH;
  payload: UserInitialState;
}

type UserActions = UserActionFetch;

export { ActionsType };
export type { UserInitialState, UserActionFetch, UserActions };
