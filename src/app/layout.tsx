"use client";

import {
  FunctionComponent,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { Roboto } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import faviconIcon from "@/images/favicon.ico";
import {
  StoreProvider,
  bookmarksFetchAction,
  useStore,
  userFetchAction,
} from "@/store";
import { onAddUserLogin, onGetBookmarks, onGetUser } from "@/actions";
import { Header } from "@/components";
import "@/styles/classes.scss";
import "@/styles/globals.scss";

interface Props {
  children: React.ReactNode
}

const inter = Roboto({ subsets: ["latin"], weight: "400" });

const RootLayout: FunctionComponent<Props> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoading, setIsloading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [, dispatch] = useStore();
  const initStoreRef = useRef<boolean>(false);

  useEffect(() => {
    const { current: isInitStore } = initStoreRef;

    if (pathname === "/auth" && !isInitStore) {
      setIsloading(false);
      return;
    }

    Promise.all([
      onGetUser().then(({ data }) => {
        if (data) {
          dispatch(userFetchAction(data));

          fetch("https://json.geoiplookup.io")
            .then((res) => res.json())
            .then((d: { city?: string }) => {
              onAddUserLogin(d?.city);
            });
        } else {
          setIsError(true);
        }
      }),
      onGetBookmarks().then(({ data }) => {
        if (data) {
          dispatch(bookmarksFetchAction(data));
        } else {
          setIsError(true);
        }
      }),
    ]).finally(() => {
      setIsloading(false);
    });
  }, [pathname]);

  if (isError) {
    router.push("/auth");
  }

  return (
    <html lang="en">
      <head>
        <title>Kinoyo</title>
        <link
          rel="icon"
          type="image/x-icon"
          href={faviconIcon.src}
        />
      </head>

      <body className={inter.className}>
        {isLoading ? (
          <div className="loading">
            <div className="loading__filmstrip" />
            <h1 className="loading__title">LOADING</h1>
          </div>
        ) : (
          <>
            <Header />
            {children}
          </>
        )}

        {process.env.NODE_ENV === "production" && (
          <Analytics />
        )}
      </body>
    </html>
  );
};

const ContextRootLayout: FunctionComponent<Props> = ({ children }) => (
  <StoreProvider>
    <RootLayout>
      {children}
    </RootLayout>
  </StoreProvider>
);

export default ContextRootLayout;
