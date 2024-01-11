import { PremiereType } from "@/types";

interface BookmarkType {
  id: string
  knId: number
  name: string
  iframe: string
  premiere?: PremiereType
}

interface BookmarkModel {
  id: string
  userId: string
  knId: number
  name: string
  iframe: string
}

export type { BookmarkType, BookmarkModel };
