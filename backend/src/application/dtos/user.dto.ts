export interface RegisterUserDTO {
  name: string;
  email: string;
  password: string;
  role: 'CLIENT' | 'VENDOR';
  isAdultConfirmed: boolean;
}

export interface AuthenticateUserDTO {
  email: string;
  password: string;
}

export interface AuthResponseDTO {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    emailVerified: boolean;
  };
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenDTO {
  refreshToken: string;
}

export interface ConfirmEmailDTO {
  token: string;
}

export interface RequestPasswordResetDTO {
  email: string;
}

export interface ResetPasswordDTO {
  token: string;
  newPassword: string;
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
}

export interface ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
}
