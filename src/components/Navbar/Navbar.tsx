import { FunctionComponent } from "react";
import { usePrevious } from "@/hooks";
import styles from "./navbar.module.scss";

interface Props {
  nav: {
    text: string
    path: string
    width: number
  }[]
  activePath: string
  onClick: (path: string) => void
  animationTime?: number
  gridGap?: number
}

const Navbar: FunctionComponent<Props> = ({
  nav,
  activePath,
  onClick,
  animationTime = 1000,
  gridGap = 0,
}) => {
  const indexLink = nav.findIndex((item) => item.path === activePath);
  const prevIndexLink = usePrevious(indexLink);

  const getStyleSlider = () => {
    const findIndex = indexLink !== -1 ? indexLink : prevIndexLink || 0;
    const width = nav[findIndex]?.width || 0;

    const marginLeft = nav.reduce((result, link, index) => {
      if (index >= findIndex) {
        return result;
      }

      return result + link.width + gridGap;
    }, 0);

    return {
      marginLeft,
      width,
      transition: `margin ease-in-out ${animationTime}ms, width ease-in-out ${animationTime}ms`,
    };
  };

  return (
    <div className={styles.navbar}>
      <div className={styles.navbar__nav} style={{ gridGap }}>
        {nav.map(({ text, path, width }) => (
          <div
            className={styles.navbar__link}
            style={{ width }}
            key={path}
            onClick={() => onClick(path)}
            aria-hidden
          >
            {text}
          </div>
        ))}
      </div>

      <div className={styles.navbar__slider} style={getStyleSlider()} />
    </div>
  );
};

export default Navbar;
