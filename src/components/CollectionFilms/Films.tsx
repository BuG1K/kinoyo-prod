import { FunctionComponent } from "react";
import Link from "next/link";
import { Skeleton } from "@/components";
import { getClassName, getPosterFilm } from "@/resources";
import { FilmType } from "@/types";
import styles from "./films.module.scss";
import "@/styles/classes.scss";

interface Props {
  films: FilmType[]
}

const Films: FunctionComponent<Props> = ({ films }) => {
  const isLoading = !films.length;

  return (
    <Skeleton
      isLoading={isLoading}
      delay={80}
      loader={(
        <div className={styles.films}>
          {Array(20).fill(0).map((_, index) => index + 1).map((key) => (
            <div className={styles.films__film} key={`skeleton-${key}`}>
              <div
                className={getClassName(
                  "skeleton",
                  styles.films__poster,
                )}
              />

              <div
                className={getClassName(
                  "skeleton",
                  styles.films__name,
                )}
              />

              <div
                className={getClassName(
                  "skeleton",
                  styles.films__year,
                )}
                style={{ width: 40, height: 16 }}
              />
            </div>
          ))}
        </div>
      )}
    >
      <div className={styles.films}>
        {films.map((film) => (
          <Link
            className={styles.films__film}
            key={film.knId}
            href={`/film?knId=${film.knId}`}
          >
            <img
              className={styles.films__poster}
              src={getPosterFilm(film.posterUrlPreview)}
              alt={film.name}
              loading="lazy"
            />

            <div className={styles.films__name}>
              {film.name}
            </div>

            <div className={styles.films__year}>
              {film.year}
            </div>
          </Link>
        ))}
      </div>
    </Skeleton>
  );
};

export default Films;
