import {
  ChangeEvent,
  FocusEvent,
  forwardRef,
  useState,
} from "react";
import { getClassName, getClassWithlBool } from "@/resources";
import styles from "./input.module.scss";

interface Props {
  value?: string
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void,
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void,
  name?: string
  placeholder?: string
  error?: boolean
  disabled?: boolean
  message?: string
  className?: string
  defaultValue?: string
  type?: string
}

const Input = forwardRef<HTMLInputElement, Props>((
  {
    value: propsValue,
    onChange,
    onBlur: onBlurProps,
    onFocus: onFocusProps,
    name,
    placeholder,
    error,
    disabled,
    message,
    defaultValue,
    className = "",
    type = "text",
  },
  ref,
) => {
  const [value, setValue] = useState<string | undefined | null>(undefined);
  const inputId = `form-input-${name}`;
  const label = placeholder || name;
  const isFocus = value === null;
  const inNotFocus = typeof value === "string";
  const isFirstFocus = value === undefined;
  const isValue = !!value && value?.length !== 0;
  const isValueNotVoid = isValue || !!propsValue || !!defaultValue;

  const onFocus = (event: FocusEvent<HTMLInputElement>) => {
    if (onFocusProps) {
      onFocusProps(event);
    }

    setValue(null);
  };

  const onBlur = (event: FocusEvent<HTMLInputElement>) => {
    if (onBlurProps) {
      onBlurProps(event);
    }

    setValue(event.target.value);
  };

  const classNameBorder = getClassName(
    styles.input__border,
    getClassWithlBool(
      styles.input__border_focus,
      isFocus,
    ),
    getClassWithlBool(
      styles.input__border_input,
      isFocus || isValue || (isFirstFocus && isValueNotVoid),
    ),
    getClassWithlBool(
      styles.input__border_revers,
      (inNotFocus && !isFirstFocus && !isValue),
    ),
    getClassWithlBool(
      styles.input__border_default,
      isFirstFocus && isValueNotVoid,
    ),
    getClassWithlBool(
      styles.input__border_error,
      !!error,
    ),
    getClassWithlBool(
      styles.input__border_disabled,
      !!disabled,
    ),
  );

  return (
    <div className={getClassName(styles.input, className)}>
      <div className={classNameBorder}>
        <fieldset className={styles.input__container}>
          <legend className={styles.input__name}>
            {label}
          </legend>

          <label className={styles.input__placeholder} htmlFor={inputId}>
            {label}
          </label>

          <input
            ref={ref}
            className={styles.input__value}
            id={inputId}
            name={name}
            type={type}
            value={propsValue}
            autoComplete="off"
            onChange={onChange}
            disabled={disabled}
            defaultValue={defaultValue}
            onFocus={onFocus}
            onBlur={onBlur}
          />

        </fieldset>

        {message && (
          <label
            className={styles.input__message}
            htmlFor={inputId}
          >
            {message}
          </label>
        )}
      </div>
    </div>
  );
});

export default Input;
