/* eslint-disable no-underscore-dangle */

"use server";

import { mongo } from "mongoose";
import { Premiere } from "@/database";
import { onGetPremierInfo } from "@/actions";
import { onCheckDiffDateDays } from "@/resources";
import { OnGetPremieresResponse, PremiereModel, PremiereType } from "@/types";

const getPremiere = (doc: any) => ({
  id: doc._id.toString(),
  knId: doc.knId,
  type: doc.type,
  lastUpdated: doc.lastUpdated,
  episodesLastSeason: doc.episodesLastSeason,
  episodesLastEpisode: doc.episodesLastEpisode,
  episodesLastDate: doc.episodesLastDate,
  episodesNextSeason: doc.episodesNextSeason,
  episodesNextEpisode: doc.episodesNextEpisode,
  episodesNextDate: doc.episodesNextDate,
  premier: doc.premier,
});

const onGetPremieres = async (knIds: number[]) => {
  const result: OnGetPremieresResponse = {
    data: null,
    error: false,
    message: "",
  };

  const date = new Date(new Date().toISOString());
  const requests: mongo.AnyBulkWriteOperation<PremiereModel>[] = [];
  const premieres: PremiereType[] = [];

  const findPremieres = (await Premiere.find({
    knId: { $in: knIds },
  }));

  await Promise.all(findPremieres.map(async (doc) => {
    const daysLag = onCheckDiffDateDays(date, doc.lastFetch);

    if (daysLag >= 6) {
      const premierInfo = await onGetPremierInfo(doc.knId);

      if (premierInfo.data) {
        const premier = getPremiere(doc);
        const premierJSON = JSON.stringify(premier);
        const fetchPremierJSON = JSON.stringify({
          ...premierInfo.data, id: doc._id.toString(),
        });
        const isUpdated = premierJSON !== fetchPremierJSON;
        const $set = !isUpdated ? { lastFetch: date } : {
          ...premierInfo.data,
          lastFetch: date,
          lastUpdated: date,
        };

        premieres.push(premierInfo.data);
        requests.push({
          updateOne: {
            filter: { _id: doc._id },
            update: { $set },
          },
        });
      }
    } else {
      premieres.push(getPremiere(doc));
    }
  }));

  if (requests.length) {
    Premiere.bulkWrite(requests);
  }

  result.data = premieres;

  return result;
};

export default onGetPremieres;
