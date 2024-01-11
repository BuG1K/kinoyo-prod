import { DefaultValue } from "@/hooks/useForm";

interface FormSingIn {
  email: string
  password: string
  keepIn: boolean
}

interface FromRecovery {
  email: string
}

interface FormSignUp {
  name: string
  email: string
  password: string
  confirmPassword: string
  keepIn: boolean
}

const email = {
  patternProps: {
    validation: {
      blur: [
        {
          reg: /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/,
          message: "Invalid email",
        },
      ],
    },
  },
};

const keepIn = { defaultValue: true };

const formSingIn: DefaultValue<FormSingIn> = {
  email,
  keepIn,
};

const formRecovery: DefaultValue<FromRecovery> = {
  email,
};

const formSignUp: DefaultValue<FormSignUp> = {
  email,
  keepIn,
};

export { formSingIn, formRecovery, formSignUp };
