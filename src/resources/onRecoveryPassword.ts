import { RecoveryBody } from "@/types";

const onRecoveryPassword = async (body: RecoveryBody) => {
  const url = "api/recovery";
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  const respons = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  return { data: null, status: respons.status };
};

export default onRecoveryPassword;
