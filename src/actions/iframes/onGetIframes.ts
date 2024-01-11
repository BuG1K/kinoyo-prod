"use server";

import { IframeData, IframeType, OnGetIframesResponse } from "@/types";
import { iframesDate } from "./data";

interface FetchIframeDataResult {
  name: string | null,
  iframePath: IframeType,
}

const onFetchIframeData = (
  iframe: IframeData,
  knId: number,
) => new Promise<FetchIframeDataResult>((resolve) => {
  const result: FetchIframeDataResult = {
    name: null,
    iframePath: {
      id: iframe.id,
      name: iframe.name,
      error: true,
      path: null,
    },
  };
  const timer = 6000;

  setTimeout(() => resolve(result), timer);

  fetch(iframe.getUrl(knId))
    .then((respons) => respons.json())
    .then((obj) => {
      result.iframePath.path = iframe.getPath(obj);
      result.name = iframe.getFilmName(obj);

      if (result.iframePath.path) {
        result.iframePath.error = false;
      }

      resolve(result);
    }).catch(() => {
      resolve(result);
    });
});

const onGetIframes = async ({
  knId,
  iframeName,
  exceptions = [],
}: {
  knId: number,
  iframeName?: string
  exceptions?: string[]
}) => {
  const result: OnGetIframesResponse = {
    data: {
      knId,
      name: null,
      iframes: [],
    },
    error: false,
    message: "",
  };
  const dat = iframesDate.filter((iframe) =>
    !exceptions.includes(iframe.name));
  let iframes: FetchIframeDataResult[] = [];

  if (iframeName) {
    const findIframe = dat.find((iframe) => iframe.name === iframeName);

    if (findIframe) {
      iframes = await new Promise<FetchIframeDataResult[]>((resolve) => {
        const arr: FetchIframeDataResult[] = [];

        Promise.all(dat.map((iframeData) =>
          onFetchIframeData(iframeData, knId).then((respons) => {
            if (
              respons.iframePath.name === iframeName
              && !respons.iframePath.error
            ) {
              resolve([respons, ...arr]);
            } else {
              arr.push(respons);
            }
          })))
          .finally(() => {
            resolve(arr);
          });
      });
    }
  } else {
    await Promise.all(dat.map((iframeData) =>
      onFetchIframeData(iframeData, knId).then((respons) => {
        iframes.push(respons);
      })));
  }

  const names = iframes.reduce((res, iframe) => {
    const key = iframe.name;

    if (!key) {
      return res;
    }

    if (key in result) {
      return { ...res, [key]: res[key] + 1 };
    }

    return { ...res, [key]: 1 };
  }, {} as { [name: string]: number});

  const { name } = Object.entries(names).reduce((res, [key, count]) => {
    if (count > res.count) {
      return { name: key, count };
    }

    return res;
  }, { name: "", count: 0 });

  result.data = {
    knId,
    name,
    iframes: iframes.map(({ iframePath }) => iframePath),
  };

  return result;
};

export default onGetIframes;
