export enum IAccountType {
  ADMIN = 0,
  GUEST = 1, // Can view announcements, and sees message about no role assigned.
  STUDENT = 2,
  PARENT = 3,
  TEACHER = 4,
  PRINCIPAL = 5,
  SCHOOL_SECRETARY = 6,
  STUDY_INSTRUCTOR = 7,
  STAFF = 8,
}

export enum ISocialProvider {
  OPINSYS = "opinsys",
}

export enum ILoginResponse {
  INVALID_CREDINTIALS = "invalid_credintials",
  MFA_REQUIRED = "mfa_required",
  PWD_CHANGE_REQUIRED = "pwd_change_required",
  LOGGED_IN = "logged_in",
  CHALLENGE_NEEDED = "challenge_needed",
}

export enum Permission {
  GET_ALL_USERS = 1 << 0,
  DISABLE_LOGIN = 1 << 1,
  DISABLE_REGISTER = 1 << 2,
  DISABLE_USER = 1 << 3,
  DISABLE_ROLE = 1 << 4,
  INSTALL_PLUGIN = 1 << 5,
  UNINSTALL_PLUGIN = 1 << 6,
  ENABLE_LOGIN = 1 << 7,
  ENABLE_REGISTER = 1 << 8,
  ENABLE_USER = 1 << 9,
  ENABLE_ROLE = 1 << 10,
}

export enum ITokenType {
  ACCESS_TOKEN = "access",
  REFRESH_TOKEN = "refresh",
  MFA_TOKEN = "mfa",
  PWD_CHANGE_TOKEN = "pwd_change",
}
