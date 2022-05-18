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