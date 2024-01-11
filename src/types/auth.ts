interface SingUpBody {
  name: string
  email: string
  password: string
}

interface AuthResponse {
  id: string
  name: string
  email: string
  success: true
  token: string
}

interface SingInBody {
  email: string
  password: string
}

interface RecoveryBody {
  email: string
}

export type {
  SingUpBody,
  AuthResponse,
  SingInBody,
  RecoveryBody,
};
