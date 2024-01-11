enum FilmTypesEnum {
  film = "film",
  series = "series",
}

interface FilmType {
  knId: number
  name: string
  year: number
  ratingKn: number
  ratingImdb: number
  posterUrlPreview: string | null
  type: keyof typeof FilmTypesEnum
}

interface FilmModel extends FilmType {}

export { FilmTypesEnum };
export type { FilmType, FilmModel };
