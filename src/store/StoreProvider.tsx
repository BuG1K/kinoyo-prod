import {
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useReducer,
} from "react";
import { initialState, rootReducer } from "./reducer";

const useStoreController = () => {
  const reducer = useReducer(rootReducer, initialState);
  const store = useMemo(() => reducer, [reducer[0]]);

  return store;
};

const Context = createContext<ReturnType<typeof useStoreController>>(
  [initialState, () => null],
);

const StoreProvider = ({ children }: { children: ReactNode }) => (
  <Context.Provider value={useStoreController()}>
    {children}
  </Context.Provider>
);

const useStore = () => useContext(Context);

export { StoreProvider, useStore };
