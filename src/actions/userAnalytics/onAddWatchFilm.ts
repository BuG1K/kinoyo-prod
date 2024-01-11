"use server";

import { cookies } from "next/headers";
import { UserAnalytics } from "@/database";
import { verifyJwtToken } from "@/resources";

const onAddWatchFilm = async (knId: number) => {
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
    return null;
  }

  const findUserAnalytics = await UserAnalytics.findOne({ userId });
  const knIdToString = String(knId);

  if (findUserAnalytics) {
    if (findUserAnalytics?.films) {
      const value = findUserAnalytics.films.get(knIdToString);

      findUserAnalytics.films.set(
        String(knId),
        value ? value + 1 : 1,
      );
    } else {
      const films = new Map();

      films.set(knIdToString, 1);
      findUserAnalytics.films = films;
    }

    await findUserAnalytics.save();
  } else {
    const date = new Date(new Date().toISOString());
    const films = { [knIdToString]: 1 };
    const newUserAnalytics = new UserAnalytics({
      userId,
      lastLogin: date,
      films,
    });

    await newUserAnalytics.save();
  }

  return result;
};

export default onAddWatchFilm;
