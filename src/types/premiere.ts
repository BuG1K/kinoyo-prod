import { FilmTypesEnum } from "@/types";

interface PremiereType {
  id: string
  knId: number
  type: keyof typeof FilmTypesEnum,
  lastUpdated: Date
  episodesLastEpisode?: number
  episodesLastSeason?: number
  episodesLastDate?: string
  episodesNextEpisode?: number
  episodesNextSeason?: number
  episodesNextDate?: string
  premier?: string
}

interface PremiereModel extends PremiereType {
  lastFetch: Date
}

export type { PremiereType, PremiereModel };
