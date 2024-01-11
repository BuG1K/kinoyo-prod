import {
  CSSProperties,
  FunctionComponent,
  RefObject,
  createRef,
  useEffect,
  useRef,
  useState,
} from "react";
import { getClassName, getClassWithlBool } from "@/resources";
import styles from "./slider.module.scss";

interface Props {
  slides: FunctionComponent[]
  indexSlide: number
  animationTime?: number,
  width: number,
}

const SliderComponent: FunctionComponent<Props> = ({
  slides,
  indexSlide: propsIndex,
  animationTime = 1000,
  width,
}) => {
  const [activeIndex, setActiveIndex] = useState(propsIndex);
  const [height, setHeight] = useState(0);
  const refNextSlide = createRef<HTMLDivElement>();
  const timer = useRef<NodeJS.Timeout>();
  const isRightSwipe = propsIndex > activeIndex;
  const isLeftSwipe = propsIndex < activeIndex;
  const isNotSwipe = !isRightSwipe && !isLeftSwipe;
  const slideStyle: CSSProperties = {
    height: height || "auto",
    transition: `height ${animationTime / 2}ms ease`,
  };

  useEffect(() => {
    const { current: nextSlide } = refNextSlide;

    if (nextSlide) {
      setHeight(nextSlide.getBoundingClientRect().height);
    }

    if (!isNotSwipe) {
      timer.current = setTimeout(() => {
        setActiveIndex(propsIndex);
      }, animationTime);
    }

    return () => {
      clearTimeout(timer.current);
    };
  }, [propsIndex]);

  const renderSlide = (
    className: string,
    Slide: FunctionComponent,
    ref?: RefObject<HTMLDivElement>,
  ) => {
    if (!Slide) return null;

    return (
      <div
        className={getClassName(styles.slider__slide, className)}
        style={{ animationDuration: `${animationTime}ms`, width }}
        ref={ref}
      >
        <Slide />
      </div>
    );
  };

  const renderMiddleSlide = () => {
    const slide = slides[activeIndex];
    const className = getClassName(
      getClassWithlBool(
        styles.slider__slide_middle,
        isNotSwipe,
      ),
      getClassWithlBool(
        styles.slider__slide_middleLeft,
        isRightSwipe,
      ),
      getClassWithlBool(
        styles.slider__slide_middleRight,
        isLeftSwipe,
      ),
    );

    return renderSlide(className, slide);
  };

  const renderNextSlide = () => {
    const slide = slides[propsIndex];
    const className = getClassName(
      getClassWithlBool(
        getClassName(
          styles.slider__slide_rightLeft,
        ),
        isRightSwipe,
      ),
      getClassWithlBool(
        styles.slider__slide_leftRight,
        isLeftSwipe,
      ),
    );

    return renderSlide(
      className,
      slide,
      refNextSlide,
    );
  };

  return (
    <div className={styles.slider} style={slideStyle}>
      {renderMiddleSlide()}
      {renderNextSlide()}
    </div>
  );
};

export type { Props as SliderComponentProps };

export default SliderComponent;
