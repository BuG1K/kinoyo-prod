"use client";

import { FunctionComponent, useEffect, useState } from "react";
import { onGetFilmCollections, onGetKinoNews } from "@/actions";
import { CollectionFilms, KinoNews, SearchFilm } from "@/components";
import { FilmType } from "@/types";
import styles from "./page.module.scss";

type Collections = {
  name: string,
  films: FilmType[]
}[]

interface AppState {
  collections: Collections | null
  newsXml: string | null
  isLoading: boolean;
}

const App: FunctionComponent = () => {
  const [data, setData] = useState<AppState>({
    collections: null,
    newsXml: null,
    isLoading: true,
  });

  useEffect(() => {
    onGetFilmCollections().then((response) => {
      if (response.data && !response.error) {
        const newCollections = Object.entries(response.data)
          .reduce<Collections>((res, [name, films]) => ([
            ...res,
            { name, films },
          ]), []);

        setData((prevState) => ({ ...prevState, collections: newCollections }));
      }
    });

    onGetKinoNews().then((response) => {
      if (!response.data || response.error) {
        return;
      }

      setData((prevState) => ({ ...prevState, newsXml: response.data }));
    });
  }, []);

  return (
    <div className={styles.app}>
      <div className={styles.app__search}>
        <SearchFilm />
      </div>

      <div className={styles.app__news}>
        <KinoNews xml={data.newsXml} isLoading={!data.newsXml} />
      </div>

      <div className={styles.app__collections}>
        <CollectionFilms
          collections={data.collections || []}
          isLoading={!data.collections}
        />
      </div>
    </div>
  );
};

export default App;
