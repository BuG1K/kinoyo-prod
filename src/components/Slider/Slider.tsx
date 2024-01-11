import { FunctionComponent } from "react";
import SliderComponent from "./SliderComponent";
import { SliderContext } from "./SliderContext";

interface Props {
  path: string
  onSetPath: (path: string) => void
  slides: {
    path: string,
    Component: FunctionComponent
  }[];
  animationTime?: number,
  width: number,
}

const Slider: FunctionComponent<Props> = (props) => {
  const { slides: slidesProps, path, onSetPath } = props;
  let activeIndex = 0;
  const paths: string[] = [];
  const slides: FunctionComponent[] = [];

  slidesProps.forEach((item, index) => {
    if (item.path === path) {
      activeIndex = index;
    }

    paths.push(item.path);
    slides.push(item.Component);
  });

  return (
    <SliderContext path={path} onSetPath={onSetPath}>
      <SliderComponent {...props} indexSlide={activeIndex} slides={slides} />
    </SliderContext>
  );
};

export default Slider;
