interface UserType {
  name: string
  lastCheckNotifications: Date
}

interface UserModel extends UserType {
  id: string
  email: string
  password: string
  hash: string
}

export type { UserType, UserModel };
