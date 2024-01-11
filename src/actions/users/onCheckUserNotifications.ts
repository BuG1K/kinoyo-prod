"use server";

import { cookies } from "next/headers";
import { User } from "@/database";
import { verifyJwtToken } from "@/resources";
import { ActionResult } from "@/types";

const onCheckUserNotifications = async () => {
  const result: ActionResult<null> = {
    data: null,
    error: true,
    message: "",
  };
  const { value: token } = cookies().get("token") || { value: null };
  const currentUser = (
    token && (await verifyJwtToken(token))
  ) as { id?: string };
  const userId = currentUser?.id || null;

  if (!userId) {
    return result;
  }

  const user = await User.findOne({ _id: userId });

  if (!user) {
    return result;
  }

  user.lastCheckNotifications = new Date(new Date().toISOString());
  user.save();
  result.error = false;

  return result;
};

export default onCheckUserNotifications;
