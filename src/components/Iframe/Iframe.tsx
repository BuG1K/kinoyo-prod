import {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Select, Icon, IconsName } from "@/components";
import {
  iframesDate,
  onAddBookmark,
  onDeleteBookmark,
  onGetIframes,
  onSetBookmark,
} from "@/actions";
import {
  bookmarksAddAction,
  bookmarksDeleteAction,
  bookmarksSetAction,
  useStore,
} from "@/store";
import { getClassName, getClassWithlBool } from "@/resources";
import { IframeType } from "@/types";
import styles from "./iframe.module.scss";
import "@/styles/classes.scss";

interface Action {
  name: string
  iconName: IconsName
  onClick: VoidFunction
}

interface Props {
  searchParamsIframeName?: string
  knId: number
}

interface Data {
  name: string
  knId: number
  iframes: IframeType[]
}

const Iframe: FunctionComponent<Props> = ({
  searchParamsIframeName,
  knId,
}) => {
  const [{ bookmarks }, dispatch] = useStore();
  const [isLoading, setIsloading] = useState(true);
  const [data, setData] = useState<Data | null>(null);
  const [iframe, setIframe] = useState<IframeType | null>(null);
  const [
    isLoadingChangeBookmark,
    setIsLoadingChangeBookmark,
  ] = useState(false);
  const [isLoadingIframe, setIsLoadingIframe] = useState(true);
  const [isLoadingIframes, setIsLoadingIframes] = useState(true);
  const [countRenderIframe, setCountRenderIframe] = useState(0);

  const bookmark = useMemo(
    () => bookmarks.find((item) => item.knId === knId),
    [bookmarks, knId],
  );

  const onFetchIframes = useCallback((fetchProps?: {
    iframeName?: string,
    exceptions?: string[],
  }) => new Promise<string[] | null>((resolve) => {
    onGetIframes({ knId, ...fetchProps }).then((response) => {
      if (response.data && !response.error) {
        const arrIframes = response.data.iframes.reduce((res, item) => {
          if (!item.error) {
            return [...res, item];
          }

          return res;
        }, [] as IframeType[]);

        if (arrIframes.length) {
          setData((prevData) => ({
            name: prevData?.name || response.data?.name || "",
            knId: prevData?.knId || response.data?.knId || NaN,
            iframes: [
              ...(prevData?.iframes || []),
              ...arrIframes,
            ],
          }));
          resolve(response.data.iframes.map(({ name }) => name));
        }

        resolve(null);
      }

      resolve(null);
    }).catch(() => resolve(null));
  }), [knId]);

  useEffect(() => {
    const defaultIframeName = searchParamsIframeName || bookmark?.iframe;

    if (defaultIframeName) {
      onFetchIframes({ iframeName: defaultIframeName }).then((names) => {
        if (names) {
          setIsloading(false);
        }

        onFetchIframes({ exceptions: names || [] }).finally(() => {
          setIsLoadingIframes(false);
          setIsloading(false);
        });
      });
    } else {
      const iframeNames = iframesDate.map(({ name }) => name);
      const hfNames = Math.floor(iframeNames.length / 2);
      const pageOne = iframeNames.slice(0, hfNames);
      const pageTwo = iframeNames.slice(hfNames, iframeNames.length);

      onFetchIframes({ exceptions: pageTwo }).then((names) => {
        if (names) {
          setIsloading(false);
        }
      });

      onFetchIframes({ exceptions: pageOne }).then(() => {
        setIsloading(false);
        setIsLoadingIframes(false);
      });
    }
  }, []);

  useEffect(() => {
    if (data) {
      setIframe(data.iframes[0]);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="loading">
        <div className="loading__filmstrip" />
        <h1 className="loading__title">LOADING</h1>
      </div>
    );
  }

  if (!(data && iframe)) {
    return (
      <div className={styles.notFound}>
        <h1>404</h1>
        <h3>Not found</h3>
      </div>
    );
  }

  const onChangeIframe = (index: number) => {
    const newIframe = data.iframes[index];

    setIframe(newIframe);
    setIsLoadingIframe(true);

    if (bookmark) {
      onSetBookmark({
        id: bookmark.id,
        iframe: newIframe.name,
      }).then(({ error }) => {
        if (!error) {
          dispatch(bookmarksSetAction({
            id: bookmark.id,
            iframe: newIframe.name,
          }));
        }
      });
    }
  };

  const onChangeBookmark = () => {
    setIsLoadingChangeBookmark(true);

    if (bookmark) {
      onDeleteBookmark(bookmark.id).then(({ error }) => {
        if (!error) {
          dispatch(bookmarksDeleteAction(bookmark.id));
        }

        setIsLoadingChangeBookmark(false);
      });
    } else {
      const newBookmark = {
        knId,
        name: data.name,
        iframe: iframe.name,
      };

      onAddBookmark(newBookmark).then((response) => {
        if (!response.error && response.data) {
          dispatch(bookmarksAddAction(response.data));
        }

        setIsLoadingChangeBookmark(false);
      });
    }
  };

  const onSetCountRenderIframe = () => {
    setCountRenderIframe(countRenderIframe + 1);
    setIsLoadingIframe(true);
  };

  const actions: Action[] = [
    {
      name: "bookmark",
      iconName: "bookmark",
      onClick: onChangeBookmark,
    },
    {
      name: "share",
      iconName: "share",
      onClick: () =>
        window.navigator.clipboard.writeText(window.location.href),
    },
    {
      name: "refresh",
      iconName: "refresh",
      onClick: onSetCountRenderIframe,
    },
  ];

  return (
    <div className={styles.iframe}>
      <h2 className={styles.iframe__title}>
        {data.name}
      </h2>

      <div className={styles.iframe__header}>
        <div className={styles.iframe__selectContainer}>
          <Select
            width="140px"
            array={data.iframes.map((item) => item.name)}
            value={iframe.name}
            onChange={onChangeIframe}
          />

          {isLoadingIframes && (
            <div
              className={getClassName(
                styles.iframe__selectLoading,
                "submitButtonLoading",
              )}
            />
          )}
        </div>

        <div className={styles.iframe__actions}>
          {actions.map((action) => (
            <button
              className={getClassName(
                styles.iframe__icon,
                getClassWithlBool(
                  styles.iframe__icon_bookmark,
                  bookmark && action.name === "bookmark",
                ),
                getClassWithlBool(
                  "submitButtonLoading",
                  isLoadingChangeBookmark && action.name === "bookmark",
                ),
                "outlinedButton clickEffectButton",
              )}
              key={action.name}
              type="button"
              aria-label={action.name}
              onClick={action.onClick}
              disabled={isLoadingChangeBookmark && action.name === "bookmark"}
            >
              <Icon name={action.iconName} size={14} />
            </button>
          ))}
        </div>
      </div>

      <div
        className={getClassName(
          styles.iframe__container,
          getClassWithlBool("skeleton", isLoadingIframe),
        )}
      >
        <iframe
          className={styles.iframe__iframe}
          key={countRenderIframe}
          allowFullScreen
          src={iframe.path || undefined}
          title={`${iframe.name}-${knId}`}
          onLoad={() => setIsLoadingIframe(false)}
        />
      </div>
    </div>
  );
};

export default Iframe;
