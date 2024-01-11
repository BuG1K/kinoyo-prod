"use server";

import { cookies } from "next/headers";
import { User } from "@/database";
import { verifyJwtToken } from "@/resources";
import { OnGetUserResponse } from "@/types";

const onGetUser = async () => {
  const result: OnGetUserResponse = {
    data: null,
    error: true,
    message: "",
  };
  const { value: token } = cookies().get("token") || { value: null };
  const currentUser = (
    token && (await verifyJwtToken(token))
  ) as { id?: string };
  const userId = currentUser?.id || null;

  if (userId) {
    const user = await User.findOne({ _id: userId });

    if (user) {
      result.data = {
        name: user.name,
        lastCheckNotifications: user.lastCheckNotifications,
      };
      result.error = false;
    }
  }

  return result;
};

export default onGetUser;
