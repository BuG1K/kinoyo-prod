import {
  CSSProperties, Children, FunctionComponent,
  ReactElement, cloneElement, useEffect, useState,
} from "react";

interface Props {
  children: ReactElement
  loader: ReactElement
  isLoading?: boolean
  delay?: number
  isImgElement?: boolean
}

const Skeleton: FunctionComponent<Props> = ({
  children,
  loader,
  isLoading,
  delay,
  isImgElement,
}) => {
  const [isHideChildren, setIsHideChildren] = useState(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (!isLoading && !isImgElement) {
      timer = setTimeout(() => setIsHideChildren(false), delay);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [isLoading]);

  const key = "skeleton";
  const styleSkeleton: CSSProperties = !isHideChildren
    ? { display: "none" } : {};
  const skeleton = cloneElement(loader, { style: styleSkeleton, key });
  const childrenWithStyle = Children.map(children, (child) => {
    const styleChildren: CSSProperties = isHideChildren
      ? { position: "fixed", visibility: "hidden" } : {};
    const onLoad = isImgElement ? () => setIsHideChildren(false) : undefined;

    return cloneElement(child, { style: styleChildren, key, onLoad });
  });

  return (
    <>
      {[
        { item: skeleton, bool: isHideChildren },
        { item: childrenWithStyle, bool: true },
      ].map(({ item, bool }) => bool && item)}
    </>
  );
};

export default Skeleton;
