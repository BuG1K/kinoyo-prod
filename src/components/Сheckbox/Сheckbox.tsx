import { FormEvent, forwardRef } from "react";
import { getClassName } from "@/resources";
import checkboxImg from "@/images/checkbox-checked-filled.svg";
import styles from "./checkbox.module.scss";

interface Props {
  label?: string
  className?: string
  checked?: boolean
  defaultChecked?: boolean
  onChange?: (event: FormEvent) => void
}

const Сheckbox = forwardRef<HTMLInputElement, Props>((
  {
    label,
    className = "",
    checked,
    defaultChecked,
    onChange,
  },
  ref,
) => {
  const id = `checkbox-${label}`;

  return (
    <label
      className={getClassName(styles.checkbox, className)}
      htmlFor={id}
    >
      <input
        className={styles.checkbox__input}
        ref={ref}
        id={id}
        type="checkbox"
        checked={checked}
        defaultChecked={defaultChecked}
        onChange={onChange}
      />

      <div className={styles.checkbox__box}>
        <img
          className={styles.checkbox__icon}
          src={checkboxImg.src}
          alt="icon"
        />
      </div>

      <span className={styles.checkbox__label}>{label}</span>
    </label>
  );
});

export default Сheckbox;
