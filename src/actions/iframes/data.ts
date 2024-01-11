import { IframesData } from "@/types";

const data: IframesData = [
  {
    id: 0,
    name: "apicollaps.cc",
    url: "https://apicollaps.cc",
    token: process.env.API_COLLAPS_CC_TOKEN,
    getUrl(knId) {
      return `${this.url}/list?token=${this.token}&kinopoisk_id=${knId}`;
    },
    getFilmName(respons) {
      return respons?.results[0]?.name || null;
    },
    getPath(respons) {
      return respons?.results[0]?.iframe_url || null;
    },
  },
  {
    id: 1,
    name: "iframe.video",
    url: "https://iframe.video/api/v2",
    getUrl(knId) {
      return `${this.url}/search?kp=${knId}`;
    },
    getFilmName(respons) {
      return respons?.results[0]?.title_ru || null;
    },
    getPath(respons) {
      return respons?.results[0]?.path || null;
    },
  },
  {
    id: 2,
    name: "videocdn.tv",
    url: "https://videocdn.tv/api",
    token: process.env.VIDEOCDN_TV_TOKEN,
    getUrl(knId) {
      return `${this.url}/short?api_token=${this.token}&kinopoisk_id=${knId}`;
    },
    getFilmName(respons) {
      return respons?.data[0]?.title || null;
    },
    getPath(respons) {
      return respons?.data[0]?.iframe_src || null;
    },
  },
  {
    id: 3,
    name: "apivb.info",
    url: "https://apivb.info/api",
    token: process.env.APIVB_INFO_TOKEN,
    getUrl(knId) {
      return `${this.url}/videos.json?token=${this.token}&id_kp=${knId}`;
    },
    getFilmName(respons) {
      return respons[0]?.title_ru || null;
    },
    getPath(respons) {
      return respons[0]?.iframe_url || null;
    },
  },
  {
    id: 4,
    name: "api.alloha.tv",
    url: "https://api.alloha.tv",
    token: process.env.API_ALLOHA_TV_TOKEN,
    getUrl(knId) {
      return `${this.url}/?token=${this.token}&kp=${knId}`;
    },
    getFilmName(respons) {
      return respons?.data?.name || null;
    },
    getPath(respons) {
      return respons?.data?.iframe || null;
    },
  },
  {
    id: 5,
    name: "voidboost.tv",
    url: "https://voidboost.tv",
    straightWay: true,
    getUrl(knId) {
      return `${this.url}/embed/${knId}`;
    },
    getFilmName() {
      return null;
    },
    getPath() {
      return null;
    },
  },
  {
    id: 6,
    name: "api.bhcesh.me",
    url: "https://api.bhcesh.me",
    token: process.env.API_BHCESH_ME_TOKEN,
    getUrl(knId) {
      return `${this.url}/list?token=${this.token}&kinopoisk_id=${knId}`;
    },
    getFilmName(respons) {
      return respons?.results?.[0]?.name || null;
    },
    getPath(respons) {
      return respons?.results?.[0]?.iframe_url || null;
    },
  },
  {
    id: 7,
    name: "bazon.cc",
    url: "https://bazon.cc/api",
    token: process.env.BAZON_CC_TOKEN,
    getUrl(knId) {
      return `${this.url}/search?token=${this.token}&kp=${knId}`;
    },
    getFilmName() {
      return null;
    },
    getPath(respons) {
      return respons?.results?.[0]?.link || null;
    },
  },
  {
    id: 8,
    name: "kodikapi.com",
    url: "https://kodikapi.com",
    token: process.env.KODIKAPI_COM_TOKEN,
    getUrl(knId) {
      return `${this.url}/search?token=${this.token}&kinopoisk_id=${knId}`;
    },
    getFilmName() {
      return null;
    },
    getPath(respons) {
      return respons?.results?.[0]?.link || null;
    },
  },
];

export { data as iframesDate };
