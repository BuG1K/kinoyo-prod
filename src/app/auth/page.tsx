"use client";

import { FunctionComponent, useState } from "react";
import {
  FormRecovery,
  FormSignIn,
  FormSignUp,
  Slider,
  Navbar,
} from "@/components";
import styles from "./page.module.scss";

const forms = [
  {
    path: "signIn",
    Component: FormSignIn,
  },
  {
    path: "recovery",
    Component: FormRecovery,
  },
  {
    path: "singUp",
    Component: FormSignUp,
  },
];

const nav = [
  {
    text: "SIGN IN",
    path: "signIn",
    width: 60,
  },
  {
    text: "SIGN UP",
    path: "singUp",
    width: 65,
  },
];

const Auth: FunctionComponent = () => {
  const [formPath, setFormPath] = useState(forms[0].path);
  const animationTime = 600;

  return (
    <div className={styles.auth}>
      <Navbar
        nav={nav}
        activePath={formPath}
        onClick={(path) => setFormPath(path)}
        animationTime={animationTime}
        gridGap={10}
      />

      <div className={styles.auth__form}>
        <Slider
          width={250}
          animationTime={animationTime}
          path={formPath}
          onSetPath={(path) => setFormPath(path)}
          slides={forms}
        />
      </div>
    </div>
  );
};

export default Auth;
