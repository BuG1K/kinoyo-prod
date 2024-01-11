interface IframeData {
  id: number
  name: string
  straightWay?: boolean
  url: string
  token?: string
  urlItPath?: true
  getUrl: (knId: number) => string
  getFilmName: (respons: any) => string | null
  getPath: (respons: any) => string | null
}

type IframesData = IframeData[]

interface IframeType {
  id: number
  name: string
  error: boolean
  path: string | null
}

export type { IframeData, IframesData, IframeType };
