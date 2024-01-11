const getClassWithlBool = (
  className: string,
  boolean: boolean | null | undefined,
) => (boolean ? className : "");

const getClassName = (...styles: string[]) =>
  styles.reduce((result, str, index) => {
    const className = str || "";

    if (className.length !== 0 && result.length !== 0) {
      return `${result} ${className}`;
    } if (index === 0 || result.length === 0) {
      return className;
    }

    return result;
  }, "");

export { getClassWithlBool, getClassName };
