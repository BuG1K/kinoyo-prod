import { FunctionComponent } from "react";
import Link from "next/link";
import { getPosterFilm } from "@/resources";
import imdbkIcon from "@/images/imdb-icon.svg";
import kinopoiskIcon from "@/images/kinopoisk-iocn.svg";
import styles from "./searchFilmCard.module.scss";

interface Props {
  knId: number
  posterUrlPreview: string | null
  name: string
  ratingImdb: number
  ratingKn: number
  year: number
}

const SearchFilmCard: FunctionComponent<Props> = ({
  knId,
  posterUrlPreview,
  name,
  ratingImdb,
  ratingKn,
  year,
}) => {
  const poster = getPosterFilm(posterUrlPreview, "small");

  const renderRating = (
    rating: number,
    src: any,
    alt: string,
    className: string,
  ) => (rating ? (
    <>
      <span>{rating}</span>
      <img
        className={className}
        src={src}
        alt={alt}
      />
    </>
  ) : null);

  return (
    <Link className={styles.searchFilmCard} href={`/film?knId=${knId}`}>
      <img
        className={styles.searchFilmCard__poster}
        src={poster}
        alt={name}
        loading="lazy"
      />

      <div className={styles.searchFilmCard__depiction}>
        <h6 className={styles.searchFilmCard__name}>{name}</h6>

        <div className={styles.searchFilmCard__raiting}>
          {renderRating(
            ratingImdb,
            imdbkIcon.src,
            imdbkIcon,
            styles.searchFilmCard__iconIm,
          )}

          {renderRating(
            ratingKn,
            kinopoiskIcon.src,
            kinopoiskIcon,
            styles.searchFilmCard__iconKn,
          )}

          <span className={styles.searchFilmCard__year}>{year}</span>
        </div>
      </div>
    </Link>
  );
};

export default SearchFilmCard;
