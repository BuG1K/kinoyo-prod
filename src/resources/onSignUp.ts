import { SingUpBody, AuthResponse } from "@/types";

const onSignUp = async (body: SingUpBody) => {
  const url = "api/signup";
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  let data = null;
  let status = 200;

  const respons = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (respons.status === 200) {
    data = await respons.json() as AuthResponse;
  } else {
    status = respons.status;
  }

  return { data, status };
};

export default onSignUp;
