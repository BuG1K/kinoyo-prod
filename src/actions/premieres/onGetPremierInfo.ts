"use server";

import { onCheckDiffDateDays } from "@/resources";
import {
  FilmTypesEnum,
  OnGetPremierInfoResponse,
  PremiereType,
} from "@/types";

interface FilmRespons {
  type: "FILM" | "TV_SERIES"
}

interface PremierRespons {
  items: {
    type: "WORLD_PREMIER" | string
    date: string
  }[]
}

interface Episode {
  seasonNumber: number
  episodeNumber: number
  releaseDate: string
}

interface SeasonsRespons {
  total: number
  items: {
    number: number
    episodes: Episode[]
  }[]
}

const kinopoisApiUrl = process.env.KINOPOISK_API_V2_URL || "";
const requestInit: RequestInit = {
  method: "GET",
  headers: {
    "X-API-KEY": process.env.KINOPOISK_API_V2_TOKEN || "",
    "Content-Type": "application/json",
  },
};

const onFetch = async <Data>(params: string) => {
  const respons = await fetch(kinopoisApiUrl + params, requestInit);

  if (respons.status !== 200) {
    return null;
  }

  const data = await respons.json();

  return data as Data;
};

const onGetPremierInfo = async (knId: number) => {
  const result: OnGetPremierInfoResponse = {
    data: null,
    error: true,
    message: "",
  };

  const filmData = await onFetch<FilmRespons>(`/films/${knId}`);

  if (!filmData) {
    return result;
  }

  const date = new Date(new Date().toISOString());
  const resultData: PremiereType = {
    id: "",
    knId,
    type: filmData.type === "FILM" ? FilmTypesEnum.film : FilmTypesEnum.series,
    lastUpdated: date,
  };

  if (resultData.type === FilmTypesEnum.film) {
    const premierData = await onFetch<PremierRespons>(
      `/films/${knId}/distributions`,
    );

    if (premierData) {
      premierData.items.forEach((item) => {
        if (item.type === "WORLD_PREMIER") {
          const itemDate = new Date(item.date);
          const daysLag = onCheckDiffDateDays(itemDate, date);

          if (daysLag <= 90) {
            resultData.premier = item.date;
          }
        }
      });
    }
  } else if (resultData.type === FilmTypesEnum.series) {
    const seasonsData = await onFetch<SeasonsRespons>(
      `/films/${knId}/seasons`,
    );

    if (seasonsData) {
      const dateTime = date.getTime();
      const episodesResult: { last?: Episode, next?: Episode } = {};

      seasonsData.items.forEach(({ episodes }) => {
        episodes.forEach(({ releaseDate, seasonNumber, episodeNumber }) => {
          const episodeDate = new Date(releaseDate);
          const episodeDateTime = episodeDate.getTime();
          const item: Episode = { seasonNumber, episodeNumber, releaseDate };
          const daysLag = onCheckDiffDateDays(episodeDate, date);

          if (daysLag <= 90) {
            if (episodeDateTime < dateTime) {
              episodesResult.last = item;
            } if (episodeDateTime >= dateTime && !episodesResult.next) {
              episodesResult.next = item;
            }
          }
        });
      });

      resultData.episodesLastSeason = episodesResult.last?.seasonNumber;
      resultData.episodesLastEpisode = episodesResult.last?.episodeNumber;
      resultData.episodesLastDate = episodesResult.last?.releaseDate;
      resultData.episodesNextSeason = episodesResult.next?.seasonNumber;
      resultData.episodesNextEpisode = episodesResult.next?.episodeNumber;
      resultData.episodesNextDate = episodesResult.next?.releaseDate;
    }
  }

  if (!(resultData.premier
    || resultData.episodesLastEpisode
    || resultData.episodesNextDate)
  ) {
    return result;
  }

  result.data = resultData;
  result.error = false;

  return result;
};

export default onGetPremierInfo;
