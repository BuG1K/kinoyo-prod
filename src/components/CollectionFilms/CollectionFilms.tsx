import { FunctionComponent, useEffect, useState } from "react";
import { Skeleton } from "@/components";
import Films from "./Films";
import { getClassName, getClassWithlBool } from "@/resources";
import { FilmType } from "@/types";
import styles from "./collectionFilms.module.scss";
import "@/styles/classes.scss";

interface Props {
  collections: {
    name: string,
    films: FilmType[]
  }[]
  isLoading: boolean
}

const CollectionFilms: FunctionComponent<Props> = ({ collections, isLoading }) => {
  const [pathСollection, setPathCollections] = useState("");

  useEffect(() => {
    if (collections) {
      setPathCollections(collections[0]?.name || "");
    }
  }, [collections]);

  const collection = collections?.find(({ name }) => name === pathСollection)
    || undefined;

  return (
    <div className={styles.collections}>
      <Skeleton
        isLoading={isLoading}
        loader={(
          <div style={{ marginLeft: -5, display: "flex" }}>
            {[68, 77, 162].map((width) => (
              <div
                className={getClassName(
                  "skeleton",
                  styles.collections__navButton,
                )}
                style={{ margin: "0 5px", width, display: "inline-block" }}
                key={`skeleton-${width}`}
              >
                s
              </div>
            ))}
          </div>
        )}
      >
        <div>
          {collections.map(({ name }) => (
            <button
              className={getClassName(
                styles.collections__navButton,
                getClassWithlBool(
                  styles.collections__navButton_active,
                  name === pathСollection,
                ),
                "clickEffectButton",
              )}
              key={name}
              type="button"
              onClick={() => setPathCollections(name)}
            >
              <h5 className={styles.collections__navName}>
                {name}
              </h5>
            </button>
          ))}
        </div>
      </Skeleton>

      <div className={styles.collections__slider}>
        <Films films={collection?.films || []} />
      </div>
    </div>
  );
};

export default CollectionFilms;
