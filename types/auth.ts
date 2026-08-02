export interface SignUpForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SignInForm {
  email: string;
  password: string;
}

export interface VerifyForm {
  email: string;
  code: string;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}