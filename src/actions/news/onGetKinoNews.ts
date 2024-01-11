"use server";

import { onGetRedis } from "@/database";
import { OnGetgetKinoNewsResponse } from "@/types";

const kinonewsUrl = "https://www.kinonews.ru/rss/";

const onGetKinoNews = async () => {
  const result: OnGetgetKinoNewsResponse = {
    data: null,
    error: true,
    message: "",
  };

  const data = await onGetRedis("kinoNews", 1, async () => {
    const response = await fetch(kinonewsUrl);

    if (response.status !== 200) {
      return null;
    }

    const xml = await response.text();

    return xml;
  });

  if (!data) {
    return result;
  }

  result.data = data;
  result.error = false;

  return result;
};

export default onGetKinoNews;
