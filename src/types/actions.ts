import {
  BookmarkType,
  FilmType,
  IframeType,
  PremiereType,
  UserType,
} from "@/types";

interface ActionResult<Data> {
  data: Data | null
  error: boolean
  message: string
}

type OnGetUserResponse = ActionResult<UserType>

type OnSearchFilmsResponse = ActionResult<FilmType[]>

type OnGetSimilarFilmsResponse = ActionResult<number[]>

type OnGetTopFilmsResponse = ActionResult<FilmType[]>

type OnGetPopularFilmsResponse = ActionResult<FilmType[]>

type OnGetRecommendationFilmsResponse = ActionResult<FilmType[]>

type OnGetFilmCollectionsResponse = ActionResult<{
  [name: string]: FilmType[]
}>

type OnGetIframesResponse = ActionResult<{
  knId: number
  name: string | null
  iframes: IframeType[]
}>

type OnAddBookmarkResponse = ActionResult<BookmarkType>

type OnGetBookmarksResponse = ActionResult<BookmarkType[]>

type OnAddPremiereResponse = ActionResult<PremiereType>

type OnGetPremieresResponse = ActionResult<PremiereType[]>

type OnGetPremierInfoResponse = ActionResult<PremiereType>

type OnGetgetKinoNewsResponse = ActionResult<string>

export type {
  ActionResult,
  OnGetUserResponse,
  OnSearchFilmsResponse,
  OnGetTopFilmsResponse,
  OnGetPopularFilmsResponse,
  OnGetRecommendationFilmsResponse,
  OnGetFilmCollectionsResponse,
  OnGetSimilarFilmsResponse,
  OnGetIframesResponse,
  OnAddBookmarkResponse,
  OnGetBookmarksResponse,
  OnAddPremiereResponse,
  OnGetPremieresResponse,
  OnGetPremierInfoResponse,
  OnGetgetKinoNewsResponse,
};
