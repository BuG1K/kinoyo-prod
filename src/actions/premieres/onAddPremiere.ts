/* eslint-disable no-underscore-dangle */

"use server";

import { Premiere } from "@/database";
import { onGetPremierInfo } from "@/actions";
import { OnAddPremiereResponse } from "@/types";

const onAddPremiere = async (knId: number) => {
  const result: OnAddPremiereResponse = {
    data: null,
    error: true,
    message: "",
  };

  const findPremiere = await Premiere.findOne({ knId });

  if (findPremiere) {
    result.data = {
      id: findPremiere._id.toString(),
      knId: findPremiere.knId,
      type: findPremiere.type,
      lastUpdated: findPremiere.lastUpdated,
      episodesLastSeason: findPremiere.episodesLastSeason,
      episodesLastEpisode: findPremiere.episodesLastEpisode,
      episodesLastDate: findPremiere.episodesLastDate,
      episodesNextSeason: findPremiere.episodesNextSeason,
      episodesNextEpisode: findPremiere.episodesNextEpisode,
      episodesNextDate: findPremiere.episodesNextDate,
    };
    result.error = false;

    return result;
  }

  const premiereInfo = await onGetPremierInfo(knId);

  if (!premiereInfo.data) {
    return result;
  }

  const date = new Date(new Date().toISOString());
  const newPremiere = await new Premiere({
    ...premiereInfo.data,
    lastFetch: date,
  });

  newPremiere.save();
  result.data = { ...premiereInfo.data, id: newPremiere._id.toString() };
  result.error = false;

  return result;
};

export default onAddPremiere;
