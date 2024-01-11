import { UserType } from "@/types";
import { UserActionFetch, ActionsType } from "./types";

const userFetchAction = (user: UserType): UserActionFetch => ({
  type: ActionsType.USER_FETCH,
  payload: user,
});

export { userFetchAction };
