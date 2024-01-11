import {
  FunctionComponent,
  ReactElement,
  createContext,
  useContext,
  useMemo,
} from "react";

interface Props {
  path: string
  onSetPath: (path: string) => void
  children: ReactElement
}

interface ContextType {
  path: string
  onSetPath: (path: string) => void
}

const Context = createContext(null as unknown as ContextType);

const SliderContext: FunctionComponent<Props> = (props) => {
  const { path, onSetPath, children } = props;

  const value = useMemo(() => ({
    path,
    onSetPath,
  }), [path, onSetPath]);

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
};

const useSlider = () => useContext(Context);

export { useSlider, SliderContext };
