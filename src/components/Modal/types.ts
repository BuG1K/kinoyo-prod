import { FunctionComponent, ReactElement, RefObject } from "react";

interface DefaultProps {
  isOpen: boolean
  anchor?: HTMLElement | null
}

interface PropsWithHcandleClick extends DefaultProps {
  onClose: VoidFunction
  children: FunctionComponent<RefObject<HTMLDivElement>>
}

interface PropsWithOutHcandleClick extends DefaultProps {
  onClose?: undefined
  children: ReactElement
}

type PropsModal = DefaultProps
  & (PropsWithHcandleClick | PropsWithOutHcandleClick);

type MyIsValidElement = (object: object | null | undefined) => object is ReactElement

export type { PropsModal, MyIsValidElement };
