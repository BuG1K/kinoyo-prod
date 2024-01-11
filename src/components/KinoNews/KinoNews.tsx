import {
  FunctionComponent, useCallback, useEffect,
  useMemo, useState,
} from "react";
import Link from "next/link";
import { Skeleton } from "@/components";
import { getClassName } from "@/resources";
import { useResize } from "@/hooks";
import styles from "./kinoNews.module.scss";
import "@/styles/classes.scss";

interface Props {
  xml: string | null
  isLoading: boolean
}

interface NewsItem {
  id: number
  title: string
  description: string
  poster: string | null
  date: Date
  link: string
}

const KinoNews: FunctionComponent<Props> = ({ xml, isLoading }) => {
  const screen = useResize();
  const [news, setNews] = useState<NewsItem[]>([]);
  const localStorageKey = "viewdNews";
  const maxItems = 6;
  let quantity = 1;

  if (screen.type === "screen-xxs") {
    quantity = 1;
  } else if (screen.type === "screen-lg") {
    quantity = 4;
  } else if (!screen.isMobile) {
    quantity = maxItems;
  }

  const onGetLocalStorage = useCallback(() => {
    const viewdNewsLocalStorage = localStorage.getItem(localStorageKey);
    const viewdNews: number[] = viewdNewsLocalStorage
      ? JSON.parse(viewdNewsLocalStorage) : [];

    return viewdNews;
  }, []);

  const onWriteLocalStorage = useCallback((ids: number[]) => {
    const viewdNews = onGetLocalStorage();
    const maxLength = 30;

    const setLocalStorage = (items: number[]) => {
      localStorage.setItem(localStorageKey, JSON.stringify(items));
    };

    if (viewdNews.length + ids.length >= maxLength) {
      setLocalStorage([]);
    } else {
      const newViewdNews = [...viewdNews, ...ids];
      const filterViewdNews = newViewdNews.filter(
        (item, index) => newViewdNews.indexOf(item) === index,
      );

      setLocalStorage(filterViewdNews);
    }
  }, []);

  const onGetNews = (propsXml: string) => {
    const parser = new DOMParser();
    const xmlDOM = parser.parseFromString(propsXml, "text/xml");
    const listNode = xmlDOM.querySelectorAll("item");
    const result: NewsItem[] = [];

    listNode.forEach((node) => {
      const titleElement = node.querySelector("title");
      const linkElement = node.querySelector("link");
      const descriptionElement = node.querySelector("description");
      const enclosureElement = node.querySelector("enclosure");
      const pubDateElement = node.querySelector("pubDate");
      const guidElement = node.querySelector("guid");
      const isFullElements = titleElement && linkElement
        && descriptionElement && enclosureElement
        && pubDateElement && guidElement;

      if (isFullElements) {
        const date = new Date(pubDateElement.innerHTML);
        const id = date.getTime();

        result.push({
          id,
          title: titleElement.innerHTML,
          description: descriptionElement.innerHTML,
          poster: enclosureElement.getAttribute("url"),
          date,
          link: guidElement.innerHTML,
        });
      }
    });

    if (result.length) {
      return result;
    }

    return null;
  };

  const onGetNewsFilter = useCallback((items: NewsItem[]) => {
    const viewdNews = onGetLocalStorage();

    let itemsFilter = items.reduce((res, item) => {
      if (!viewdNews.includes(item.id)) {
        return [...res, item];
      }

      return res;
    }, [] as NewsItem[]);

    if (itemsFilter.length > maxItems) {
      itemsFilter = itemsFilter.length ? itemsFilter : [];
      const viewdIds = viewdNews.slice(0, maxItems - itemsFilter.length);

      const otherItems = viewdIds.reduce((res, id) => {
        const newsItem = items.find((item) => item.id === id);

        if (newsItem) {
          return [...res, newsItem];
        }

        return res;
      }, [] as NewsItem[]);

      return [...itemsFilter, ...otherItems];
    }

    return itemsFilter;
  }, []);

  useEffect(() => {
    if (xml) {
      const items = onGetNews(xml);

      if (items) {
        setNews(onGetNewsFilter(items));
      }
    }
  }, [xml]);

  const showItems = useMemo<NewsItem[]>(() => {
    if (!news.length) {
      return [];
    }

    const result = news.slice(0, quantity);

    onWriteLocalStorage(result.map(({ id }) => id));

    return result;
  }, [news, screen]);

  if (!showItems.length && !isLoading) {
    return null;
  }

  const items: NewsItem[] = showItems.length
    ? showItems : Array(quantity).fill(0).map(
      (_, index) => ({ id: index + 1 } as NewsItem),
    );

  return (
    <div className={styles.kinoNews}>
      {items.map((item) => (
        <div className={styles.kinoNews__card} key={item.id}>
          <Skeleton
            isLoading={isLoading}
            isImgElement
            loader={(
              <div
                className={getClassName(
                  "skeleton",
                  styles.kinoNews__img,
                  styles.kinoNews__img_skeleton,
                )}
              />
          )}
          >
            <img
              className={styles.kinoNews__img}
              src={item.poster || ""}
              alt=""
              width="100%"
              height="auto"
            />
          </Skeleton>

          <div className={styles.kinoNews__context}>
            <Skeleton
              delay={100}
              isLoading={isLoading}
              loader={(
                <h5 className={styles.kinoNews__title}>
                  <div className="skeleton" style={{ width: "98%" }}>
                    s
                  </div>
                  <div className="skeleton" style={{ marginTop: 4 }}>
                    s
                  </div>
                </h5>
              )}
            >
              <Link href={item?.link || ""} target="_blank">
                <h5 className={styles.kinoNews__title}>
                  {item.title}
                </h5>
              </Link>
            </Skeleton>

            <Skeleton
              isLoading={isLoading}
              loader={(
                <p className={styles.kinoNews__description}>
                  <span
                    className="skeleton"
                    style={{ width: "80%", display: "block" }}
                  >
                    s
                  </span>
                  <span
                    className="skeleton"
                    style={{ width: "75%", marginTop: 4, display: "block" }}
                  >
                    s
                  </span>
                </p>
              )}
            >
              <p className={styles.kinoNews__description}>
                {item.description}
              </p>
            </Skeleton>

            <Skeleton
              isLoading={isLoading}
              loader={(
                <div
                  className={getClassName(
                    "skeleton",
                    styles.kinoNews__date,
                  )}
                >
                  s
                </div>
              )}
            >
              <div className={styles.kinoNews__date}>
                {item?.date ? item.date.toISOString()
                  .slice(0, 10).split("-").reverse()
                  .join(".") : ""}
              </div>
            </Skeleton>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KinoNews;
