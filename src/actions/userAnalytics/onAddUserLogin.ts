"use server";

import { cookies } from "next/headers";
import { UserAnalytics } from "@/database";
import { verifyJwtToken } from "@/resources";

const onAddUserLogin = async (sity?: string) => {
  const result = {
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

  const date = new Date(new Date().toISOString());
  const findUserAnalytics = await UserAnalytics.findOne({ userId });

  if (findUserAnalytics && findUserAnalytics.lastLogin !== date) {
    findUserAnalytics.lastLogin = date;

    if (sity) {
      findUserAnalytics.lastSity = sity;
    }

    await findUserAnalytics.save();
  } else if (!findUserAnalytics) {
    const newUserAnalytics = new UserAnalytics({
      userId,
      lastLogin: date,
      lastSity: sity,
    });

    await newUserAnalytics.save();
  }

  result.error = false;

  return result;
};

export default onAddUserLogin;
