export enum IAccountType {
  ADMIN = 0,
  GUEST = 1,
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

export enum IEventType {
  USER_CREATED = "user_created",
  USER_UPDATED = "user_updated",
  USER_REMOVED = "user_removed",
  GET_USERS = "get_users",
  GET_USER = "get_user",
  USER_LOGIN = "user_login",
  USER_OAUTH_LOGIN = "user_oauth_login",
  USER_MFA_LOGIN = "user_mfa_login",
  STATUS = "status",
  GET_THREADS = "get_threads",
  NEW_THREAD = "new_thread",
  NEW_MESSAGE = "new_message",
  DELETE_MESSAGE = "delete_message",
  DELETE_THREAD = "delete_thread",
  EDIT_MESSAGE = "edit_message",
  MARK_THREAD_AS_READ = "mark_thread_as_read",
  MARK_THREAD_AS_UNREAD = "mark_thread_as_unread",
  ARCHIVE_THREAD = "archive_thread",
  GET_ANNOUNCEMENTS = "get_announcements",
  CREATE_ANNOUNCEMENT = "create_announcement",
  EDIT_ANNOUNCEMENT = "edit_announcement",
  ARCHIVE_ANNOUNCEMENT = "archive_announcements",
  DELETE_ANNOUNCEMENT = "delete_announcement"
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

export enum IErrorType {
  UNKNOWN = "unknown",
  INVALID_CREDENTIALS = "invalid_credentials",
  USER_NOT_FOUND = "user_not_found",
  USER_ALREADY_EXISTS = "user_already_exists",
  USER_DISABLED = "user_disabled",
  EMAIL_OR_USERNAME_REQUIRED = "email_or_username_required",
  UNSUPPORTED_PROVIDER = "unsupported_provider",
  INVALID_PROVIDER = "invalid_provider",
  INVALID_ORGANIZATION = "invalid_organization",
  INVALID_TOKEN = "invalid_token",
  INVALID_CODE = "invalid_code",
  INVALID_PERMISSION = "invalid_permission",
  PERMISSION_IS_ALREADY_ADDED = "permission_is_already_added",
  PERMISSION_NOT_FOUND = "permission_not_found",
}
