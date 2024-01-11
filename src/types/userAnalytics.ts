interface UserAnalyticsType {
  userId: string
  lastLogin: Date
  lastSity?: string
  films?: Map<string, number>
}

interface UserAnalyticsModel extends UserAnalyticsType {}

export type { UserAnalyticsType, UserAnalyticsModel };
