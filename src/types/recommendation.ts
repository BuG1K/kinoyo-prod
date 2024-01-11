interface RecommendationType {
  userId: string
  knIds: number[]
}

interface RecommendationModel extends RecommendationType {}

export type { RecommendationType, RecommendationModel };
