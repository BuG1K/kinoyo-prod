import { FunctionComponent, useState } from "react";
import { Input } from "@/components";
import {
  getClassName,
  getClassWithlBool,
  onRecoveryPassword,
} from "@/resources";
import { useForm } from "@/hooks";
import { formRecovery } from "./type";
import styles from "./form.module.scss";
import "@/styles/classes.scss";

const FormRecovery: FunctionComponent = () => {
  const {
    register,
    errors,
    onSubmit,
    onSubmitSubscribe,
    onError,
  } = useForm(formRecovery);
  const [loading, setLoading] = useState(false);

  onSubmitSubscribe(({ email }, isValid) => {
    if (!isValid) {
      return;
    }

    setLoading(true);

    onRecoveryPassword({
      email: String(email),
    }).then(() => {
      onError("email", "submit", "Email not found");
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

      <button
        className={getClassName(
          styles.form__submit,
          styles.form__submit_formRecovery,
          "submitButton",
          "clickEffectButton",
          getClassWithlBool(
            "submitButtonLoading",
            loading,
          ),
        )}
        type="submit"
      >
        Send Password
      </button>
    </form>
  );
};

export default FormRecovery;
