import {
  useRef,
  useState,
  FocusEvent,
  Ref,
  useCallback,
  FormEvent,
} from "react";

type Keys = string

type ValuesType = string | boolean

type Values<T extends object> = {
  readonly [name in keyof T]: ValuesType;
};

type DValues = {
  readonly [name: Keys]: ValuesType;
}

interface Validate {
  fun?: (value: ValuesType) => boolean
  reg?: RegExp,
  message?: string
}

enum EnumTypesValidate {
  "blur",
  "submit",
}

type TypesValidate = keyof typeof EnumTypesValidate

type Validation = {
  readonly [K in TypesValidate]?: Validate[]
}

interface PatternProps {
  validation: Validation
}

type NamesOfObjects<TValues extends object, Value> = {
  readonly [name in keyof TValues]: Value;
} | {
  readonly [name: Keys]: Value
}

interface DetailedHTMLPropsType {
  ref?: Ref<HTMLInputElement>
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void,
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void,
  defaultValue?: string
  checked?: boolean
}

type DefaultValueForRegister = {
  defaultValue?: ValuesType
  patternProps?: PatternProps
  detailedHTMLProps?: DetailedHTMLPropsType
}

type Error = {
  type: TypesValidate
  messege?: string
}

type Errors<T extends object> = NamesOfObjects<T, Error | undefined>

type Elements<T extends object> = NamesOfObjects<T, HTMLInputElement | null>

type DefaultValue<T extends object> = NamesOfObjects<
  T,
  DefaultValueForRegister
>
type SubmitData<T extends object> = NamesOfObjects<
  T,
  ValuesType
>

type SubmitCallback<Data extends object> = (
  data: SubmitData<Data>,
  isValid: boolean,
  event: FormEvent,
) => void

const useForm = <PropsValues extends Values<PropsValues> = DValues>(
  defaultValue?: DefaultValue<PropsValues>,
) => {
  const [errors, setErrors] = useState<Errors<PropsValues>>({});
  const elementsRef = useRef<Elements<PropsValues>>({});
  const submitCallbackRef = useRef<SubmitCallback<PropsValues>>();

  const onError = useCallback((
    name: keyof Errors<PropsValues>,
    type: TypesValidate,
    messege?: string,
  ) => {
    const newError: Error = { type, messege };
    setErrors({
      ...errors,
      [name]: newError,
    });
  }, [errors]);

  const middlewareFocus = useCallback((
    name: keyof Errors<PropsValues>,
    event: FocusEvent<HTMLInputElement>,
    onFocusProps?: (event: FocusEvent<HTMLInputElement>) => void,
  ) => {
    if (onFocusProps) {
      onFocusProps(event);
    }

    if (errors[name]) {
      const newState = { ...errors };

      delete newState[name];

      setErrors(newState);
    }
  }, [errors]);

  const middlewareBlur = useCallback((
    name: keyof Errors<PropsValues>,
    event: FocusEvent<HTMLInputElement>,
    validate: Validate[],
    onBlurProps?: (event: FocusEvent<HTMLInputElement>) => void,
  ) => {
    const input = event.target;
    const { value } = input;

    if (onBlurProps) {
      onBlurProps(event);
    }

    if (value.length !== 0 && validate.length !== 0) {
      let index = 0;
      let error = false;
      const item = validate[index];

      while (index <= validate.length - 1 && !error) {
        if (item.fun) {
          error = !item.fun(value);
        } if (item.reg) {
          error = !item.reg.test(value);
        }

        index += 1;
      }

      if (error) {
        onError(name, "blur", item.message);
      }
    }
  }, []);

  const middlewareRegisterRef = useCallback((
    name: keyof Elements<PropsValues>,
    element: HTMLInputElement | null,
    refProps?: Ref<HTMLInputElement>,
  ) => {
    elementsRef.current[name] = element;

    if (refProps) {
      if (typeof refProps === "function") {
        return refProps(element);
      }

      return element;
    }

    return undefined;
  }, []);

  const register = useCallback((
    name: keyof DefaultValue<PropsValues>,
    patternProps?: PatternProps,
    detailedHTMLProps?: DetailedHTMLPropsType,
  ) => {
    const defaultProps = defaultValue ? defaultValue[name] : undefined;
    const detailedProps = defaultProps
      ? defaultProps.detailedHTMLProps : detailedHTMLProps;
    const validationBlur = defaultProps
      ? defaultProps.patternProps?.validation?.blur
      : patternProps?.validation.blur;
    const defaultValueProps = detailedProps?.defaultValue
      || defaultProps?.defaultValue;
    const defaultCheckedProps = detailedProps?.checked
      || defaultProps?.defaultValue;

    return {
      ref: (element: HTMLInputElement) => middlewareRegisterRef(
        name,
        element,
        detailedProps?.ref,
      ),
      onFocus: (
        event: FocusEvent<HTMLInputElement>,
      ) => middlewareFocus(
        name,
        event,
        detailedProps?.onFocus,
      ),
      onBlur: validationBlur ? (
        event: FocusEvent<HTMLInputElement>,
      ) => middlewareBlur(
        name,
        event,
        validationBlur,
        detailedProps?.onFocus,
      ) : undefined,
      defaultValue: defaultValueProps ? String(defaultCheckedProps) : undefined,
      defaultChecked: defaultCheckedProps ? !!defaultCheckedProps : undefined,
    };
  }, [defaultValue, errors]);

  const getData = useCallback(() => {
    let defaultData = {} as PropsValues;

    if (defaultValue) {
      defaultData = Object.entries(defaultValue).reduce((
        currentValue,
        [name, props],
      ) => ({
        ...currentValue,
        [name]: props.defaultValue,
      }), {} as PropsValues);
    }

    const data = Object.entries(elementsRef.current).reduce((
      currentValue,
      [key, inputElement],
    ) => {
      const name = key as keyof DefaultValue<PropsValues>;
      let value: ValuesType | undefined = inputElement?.value;

      if (inputElement && inputElement.type === "checkbox") {
        value = inputElement.checked;
      }

      return { ...currentValue, [name]: value };
    }, {} as PropsValues);

    return { ...defaultData, ...data };
  }, [defaultValue]);

  const onSubmitSubscribe = useCallback((
    callback: SubmitCallback<PropsValues>,
  ) => {
    submitCallbackRef.current = callback;
  }, []);

  const onSubmit = useCallback((event: FormEvent) => {
    const { current: callback } = submitCallbackRef;
    event.preventDefault();

    if (!callback) {
      return;
    }

    const data = getData();
    let isValid = Object.keys(errors).length === 0;
    const values = Object.entries(data);
    let index = 0;

    while (isValid && index <= values.length - 1) {
      const value = values[index][1] as ValuesType;

      isValid = !(value === undefined || value === "");
      index += 1;
    }

    callback(
      data,
      isValid,
      event,
    );
  }, [errors]);

  return {
    errors,
    onError,
    register,
    onSubmit,
    onSubmitSubscribe,
  };
};

export type { DefaultValue };

export default useForm;
