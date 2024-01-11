import { FunctionComponent } from "react";
import {
  getClassName,
  getClassWithlBool,
  onCheckDiffDateDays,
} from "@/resources";
import { PremiereType } from "@/types";
import styles from "./premiere.module.scss";

interface Props {
  premiere: PremiereType
}

type Episode = {
  season: number
  episode: number
  date: string
} | null

const Premiere: FunctionComponent<Props> = ({ premiere }) => {
  const {
    episodesLastSeason,
    episodesLastEpisode,
    episodesLastDate,
    episodesNextSeason,
    episodesNextEpisode,
    episodesNextDate,
    premier: premierFilm,
  } = premiere;
  const islastEpisodeNotVoid = episodesLastSeason && episodesLastEpisode
    && episodesLastDate;
  const isNextEpisodeNotVoid = episodesNextSeason && episodesNextEpisode
    && episodesNextDate;
  const lastEpisode: Episode = islastEpisodeNotVoid ? {
    season: episodesLastSeason,
    episode: episodesLastEpisode,
    date: episodesLastDate,
  } : null;
  const nextEpisode: Episode = isNextEpisodeNotVoid ? {
    season: episodesNextSeason,
    episode: episodesNextEpisode,
    date: episodesNextDate,
  } : null;

  const renderEpisode = (episode?: Episode) => {
    if (!episode) {
      return null;
    }

    const episodeDateToStr = episode.date
      .slice(2).split("-").reverse().join(".");
    const episodeDate = new Date(episode.date);
    const date = new Date(new Date().toISOString());
    const daysLag = onCheckDiffDateDays(episodeDate, date);
    const isToday = daysLag === 1;

    return (
      <div
        className={getClassName(
          styles.premiere__episode,
          getClassWithlBool(
            styles.premiere__episode_today,
            isToday,
          ),
        )}
      >
        <span>{episodeDateToStr}</span>
        <span>-</span>
        <span>{`${episode.season} s`}</span>
        <span>-</span>
        <span>{`${episode.episode} e`}</span>
      </div>
    );
  };

  const renderPremiere = (dateToStr?: string) => {
    if (!dateToStr) {
      return null;
    }

    const sortDateToStr = dateToStr.slice(2).split("-").reverse().join(".");
    const episodeDate = new Date(dateToStr);
    const date = new Date(new Date().toISOString());
    const daysLag = onCheckDiffDateDays(episodeDate, date);
    const isToday = daysLag <= 10;

    return (
      <div
        className={getClassName(
          styles.premiere__episode,
          getClassWithlBool(
            styles.premiere__episode_today,
            isToday,
          ),
        )}
      >
        <span>{sortDateToStr}</span>
        <span>-</span>
        <span>premiere</span>
      </div>
    );
  };

  return (
    <div className={styles.premiere}>
      {renderEpisode(lastEpisode)}
      {renderEpisode(nextEpisode)}
      {renderPremiere(premierFilm)}
    </div>
  );
};

export default Premiere;
