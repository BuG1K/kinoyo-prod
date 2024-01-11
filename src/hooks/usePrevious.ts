import { DependencyList, useEffect, useRef } from "react";

const usePrevious = <T, >(value: T, deps?: DependencyList) => {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, deps);

  return ref.current;
};

export default usePrevious;
