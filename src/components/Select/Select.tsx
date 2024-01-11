import { FunctionComponent, useState, useRef } from "react";
import { Icon, Modal } from "@/components";
import { getClassName, getClassWithlBool } from "@/resources";
import styles from "./select.module.scss";
import "@/styles/classes.scss";

interface Props {
  width?: string
  array: string[]
  value: string
  onChange: (index: number) => void
}

const Select: FunctionComponent<Props> = ({
  array,
  width,
  value,
  onChange,
}) => {
  const ref = useRef<HTMLDivElement | null>();
  const [isOpen, setIsOpen] = useState(false);

  const onToggle = () => setIsOpen(!isOpen);

  const onSelect = (index: number) => {
    onChange(index);
    onToggle();
  };

  return (
    <div
      className={styles.select}
      style={width ? { width } : undefined}
      ref={(elementRef) => {
        ref.current = elementRef;
      }}
    >
      <div
        className={getClassName(
          styles.select__value,
          "clickEffectButton",
        )}
        onClick={onToggle}
        aria-hidden
      >
        {value}

        <Icon
          name={isOpen ? "expandLess" : "expandMore"}
          size={18}
        />
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        anchor={ref.current}
      >
        {(modalRef) => (
          <div className={styles.select__items} ref={modalRef}>
            {array.map((item, index) => (
              <div
                className={getClassName(
                  styles.select__item,
                  getClassWithlBool(
                    styles.select__item_select,
                    item === value,
                  ),
                )}
                key={item}
                onClick={() => onSelect(index)}
                aria-hidden
              >
                {item}
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Select;
