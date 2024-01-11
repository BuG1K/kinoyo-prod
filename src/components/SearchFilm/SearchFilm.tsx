import {
  ChangeEvent,
  FormEvent,
  FunctionComponent,
  useRef,
  useState,
} from "react";
import { Icon, Modal } from "@/components";
import SearchFilmCard from "./SearchFilmCard";
import { getClassName, getClassWithlBool } from "@/resources";
import { onSearchFilms } from "@/actions";
import { FilmType } from "@/types";
import styles from "./searchFilm.module.scss";
import "@/styles/classes.scss";

const SearchFilm: FunctionComponent = () => {
  const [value, setValue] = useState("");
  const [result, setResult] = useState<FilmType[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const resultRef = useRef<HTMLDivElement | null>();

  const onChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    setValue(target.value);
    setResult(null);
  };

  const onSearch = (event: FormEvent) => {
    event.preventDefault();

    if (!value) {
      return;
    }

    setIsLoading(true);

    onSearchFilms(value).then(({ data }) => {
      setResult(data || []);
      setIsLoading(false);
    });
  };

  return (
    <div
      className={getClassName(
        styles.searchFilm,
        getClassWithlBool(
          styles.searchFilmWithResult,
          result !== null,
        ),
        getClassWithlBool(
          styles.lod,
          true,
        ),
      )}
      ref={(elementRef) => {
        resultRef.current = elementRef;
      }}
    >
      <form className={styles.searchFilm__search} onSubmit={onSearch}>
        <input
          className={styles.searchFilm__input}
          type="text"
          value={value}
          onChange={onChange}
          disabled={isLoading}
          placeholder="Фильмы, сериалы, аниме"
        />

        <button
          className={getClassName(
            getClassWithlBool(
              "clickEffectButton",
              !isLoading,
            ),
            styles.searchFilm__button,
            getClassWithlBool(
              styles.searchFilmWithResult__button,
              result !== null,
            ),
          )}
          aria-label="Search"
          type="submit"
          disabled={isLoading || result !== null}
        >
          {isLoading ? (
            <div className={styles.searchFilm__loading} />
          ) : (
            <Icon name="search" color="rgb(0, 127, 255)" />
          )}
        </button>
      </form>

      <Modal
        isOpen={result !== null}
        onClose={() => setResult(null)}
        anchor={resultRef.current}
      >
        {(modalRef) => result !== null && (
          <div ref={modalRef} className={styles.searchFilm__result}>
            {result.length !== 0 ? result.map((film) => (
              <SearchFilmCard key={film.knId} {...film} />
            )) : (
              <div className={styles.searchFilm__resultError}>
                No results for&nbsp;
                <strong>{`"${value}"`}</strong>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SearchFilm;
