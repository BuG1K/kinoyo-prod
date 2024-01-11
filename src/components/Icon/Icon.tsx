import { FunctionComponent } from "react";
import data from "./data";

type IconsName = keyof typeof data

interface Props {
  name: IconsName
  color?: string
  size?: number
  className?: string
}

const Icon: FunctionComponent<Props> = ({
  name,
  color = "white",
  size = 24,
  className,
}) => {
  const paths = data[name];

  if (!paths) return null;

  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      height={size}
      width={size}
      viewBox="0 -960 960 960"
      fill={color}
    >
      {paths.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
};

export type { IconsName };
export { Icon };
