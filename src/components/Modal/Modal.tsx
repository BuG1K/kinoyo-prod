import {
  FunctionComponent,
  isValidElement,
  createRef,
  useEffect,
} from "react";
import { createPortal } from "react-dom";
import { MyIsValidElement, PropsModal } from "./types";

const Modal: FunctionComponent<PropsModal> = ({
  isOpen,
  onClose,
  anchor,
  children,
}) => {
  const ref = createRef<HTMLDivElement>();
  const myIsValidElement = isValidElement as unknown as MyIsValidElement;
  const reactElement = myIsValidElement(children) ? children : children(ref);

  useEffect(() => {
    const { current } = ref;

    if (!(isOpen && current && onClose)) {
      return () => null;
    }

    const handleClick = ({ target }: MouseEvent) => {
      if (target instanceof Node && !current?.contains(target)) {
        onClose();
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return createPortal(reactElement, anchor || document.body);
};

export default Modal;
