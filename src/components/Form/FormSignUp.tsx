import { FunctionComponent, useState } from "react";
import { Сheckbox, Input } from "@/components";
import { getClassName, getClassWithlBool, onSignUp } from "@/resources";
import { useForm } from "@/hooks";
import { formSignUp } from "./type";
import "@/styles/classes.scss";
import styles from "./form.module.scss";

const FormSignUp: FunctionComponent = () => {
  const {
    register,
    errors,
    onSubmit,
    onSubmitSubscribe,
    onError,
  } = useForm(formSignUp);
  const [loading, setLoading] = useState(false);

  onSubmitSubscribe(({
    password,
    confirmPassword,
    name,
    email,
  }, isValid) => {
    if (!isValid) {
      return;
    }

    if (password !== confirmPassword) {
      onError("confirmPassword", "submit", "Passwords don't match");

      return;
    }

    setLoading(true);

    onSignUp({
      name: String(name),
      email: String(email),
      password: String(password),
    }).then(({ status }) => {
      if (status !== 200) {
        onError("email", "submit", "Email already in use");
      } else {
        window.location.replace("/");
      }

      setLoading(false);
    });
  });

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <Input
        className={styles.form__input}
        placeholder="Name"
        {...register("name")}
      />

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

      <Input
        className={styles.form__input}
        placeholder="Confirm&nbsp;password"
        type="password"
        {...register("confirmPassword")}
        error={!!errors.confirmPassword}
        message={errors.confirmPassword?.messege}
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
          "clickEffectButton",
          getClassWithlBool(
            "submitButtonLoading",
            loading,
          ),
        )}
        type="submit"
      >
        Sign Up
      </button>
    </form>
  );
};

export default FormSignUp;
