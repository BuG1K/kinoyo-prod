import {
  FunctionComponent,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from "react";
import { Icon } from "@/components";
import styles from "./list.module.scss";

interface PropsItem {
  id: number
  value: string
  children?: ReactElement
}

interface Item extends PropsItem {
  show: boolean
  height: number
}

interface Props {
  items: PropsItem[]
  onClickItem?: (index: number) => void
}

const List: FunctionComponent<Props> = ({
  items: propsItems,
  onClickItem,
}) => {
  const defaultHeight = 40;
  const [items, setItems] = useState<Item[]>([]);
  const childrenRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    setItems(propsItems.map((item) => ({
      ...item,
      show: false,
      height: defaultHeight,
    })));
  }, [propsItems.length]);

  const onChangeShowItem = (itemIndex: number) => {
    let height = defaultHeight;
    const element = childrenRef.current[itemIndex];

    if (element) {
      height += element.clientHeight;
    }

    const newState = items.map((item, index) => {
      if (itemIndex === index) {
        const isShow = !item.show;

        return {
          ...item,
          show: isShow,
          height: isShow ? height : defaultHeight,
        };
      }

      return item;
    });

    setItems(newState);
  };

  const onClick = (target: HTMLElement, index: number) => {
    if (target.tagName !== "BUTTON" && onClickItem) {
      onClickItem(index);
    }
  };

  return (
    <ul className={styles.list}>
      {items.map(({
        id,
        value,
        children,
        show,
        height,
      }, index) => (
        <li
          className={styles.list__item}
          style={{ height }}
          key={id}
        >
          <div
            className={styles.list__value}
            style={{ height: defaultHeight }}
            onClick={({ target }) => onClick(target as HTMLElement, index)}
            aria-hidden
          >
            {children && (
              <button
                className={styles.list__arrow}
                type="button"
                aria-hidden
                onClick={() => onChangeShowItem(index)}
              >
                <Icon
                  name={show ? "expandMore" : "chevronRight"}
                  size={25}
                  color="rgb(51, 153, 255)"
                />
              </button>
            )}

            <h6 className={styles.list__name}>{value}</h6>
          </div>

          {(children) && (
            <div
              className={styles.list__children}
              ref={(ref) => {
                childrenRef.current[index] = ref;
              }}
            >
              {children}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default List;
