import { FunctionComponent, useState } from "react";
import { useSlider, Input, Сheckbox } from "@/components";
import { getClassName, getClassWithlBool, onSignIn } from "@/resources";
import { useForm } from "@/hooks";
import { formSingIn } from "./type";
import styles from "./form.module.scss";
import "@/styles/classes.scss";

const FormFormSignIn: FunctionComponent = () => {
  const {
    register,
    errors,
    onSubmit,
    onSubmitSubscribe,
    onError,
  } = useForm(formSingIn);
  const { onSetPath } = useSlider();
  const [loading, setLoading] = useState(false);

  onSubmitSubscribe(({ email, password }, isValid) => {
    if (!isValid) {
      return;
    }

    setLoading(true);

    onSignIn({
      email: String(email),
      password: String(password),
    }).then(({ status }) => {
      if (status === 200) {
        window.location.replace("/");
      } else if (status === 404) {
        onError("email", "submit", "Email not found");
      } else if (status === 400) {
        onError("password", "submit", "Incorrect password");
      }

      setLoading(false);
    });
  });

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <Input
        className={styles.form__input}
        type="email"
        placeholder="Email"
        {...register("email")}
        error={!!errors.email}
        message={errors.email?.messege}
      />

      <Input
        className={styles.form__input}
        placeholder="Password"
        type="password"
        {...register("password")}
        error={!!errors.password}
        message={errors.password?.messege}
      />

      <Сheckbox
        className={styles.form__checkbox}
        label="Keep me signed in"
        {...register("keepIn")}
      />

      <button
        className={getClassName(
          styles.form__submit,
          "submitButton",
          getClassWithlBool(
            "submitButtonLoading",
            loading,
          ),
        )}
        type="submit"
      >
        Sign In
      </button>

      <div className={styles.form__footer}>
        <a
          href="#!"
          onClick={(event) => {
            event.preventDefault();
            onSetPath("recovery");
          }}
        >
          Forgot Password?
        </a>
      </div>
    </form>
  );
};

export default FormFormSignIn;
