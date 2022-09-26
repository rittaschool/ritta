import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { IErrorType, RittaError } from '@rittaschool/shared';

export default function rittaToNestError(error: RittaError): HttpException {
  switch (error.type) {
    case IErrorType.EMAIL_OR_USERNAME_REQUIRED:
    case IErrorType.INVALID_CODE:
    case IErrorType.INVALID_CREDENTIALS:
    case IErrorType.INVALID_ORGANIZATION:
    case IErrorType.INVALID_PERMISSION:
    case IErrorType.INVALID_PROVIDER:
    case IErrorType.INVALID_TOKEN:
    case IErrorType.PERMISSION_NOT_FOUND:
    case IErrorType.PERMISSION_IS_ALREADY_ADDED:
    case IErrorType.UNSUPPORTED_PROVIDER:
    case IErrorType.USER_ALREADY_EXISTS:
    case IErrorType.USER_NOT_FOUND:
      return new BadRequestException(error.message);
    case IErrorType.USER_DISABLED:
      return new ForbiddenException(error.message);
    case IErrorType.LOGIN_ERROR:
    case IErrorType.AUTHORIZATION_ERROR:
    case IErrorType.REQUEST_ACCOUNT_NOT_FOUND:
      return new UnauthorizedException(error.message);
    case IErrorType.UNKNOWN:
    default:
      return new InternalServerErrorException(error.message);
  }
}
