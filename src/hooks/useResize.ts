import { useEffect, useState } from "react";

type ScreenType = "screen-xs" | "screen-xxs" | "screen-sm"
  | "screen-md" | "screen-lg"

interface Screen {
  type: ScreenType
  width: number
}

const screens: Screen[] = [
  { type: "screen-xs", width: 320 },
  { type: "screen-xxs", width: 425 },
  { type: "screen-sm", width: 768 },
  { type: "screen-md", width: 1024 },
  { type: "screen-lg", width: 1440 },
];

const getScreen = (width: number) => {
  let screen: Screen = screens[0];

  screens.forEach((item) => {
    if (width >= item.width) {
      screen = item;
    }
  });

  return screen;
};

const useResize = () => {
  const [screen, setScreen] = useState<Screen>(getScreen(window.innerWidth));
  const isMobile = screen.type === "screen-xs" || screen.type === "screen-xxs";

  useEffect(() => {
    const handleResize = () => {
      const newScreen = getScreen(window.innerWidth);

      if (newScreen.type !== screen.type) {
        setScreen(newScreen);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [screen]);

  return { type: screen.type, isMobile };
};

export default useResize;
