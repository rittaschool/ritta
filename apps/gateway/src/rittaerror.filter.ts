import { ExceptionFilter, Catch } from '@nestjs/common';
import { RittaError } from '@rittaschool/shared';
import rittaToNestError from './common/error';

@Catch()
export class RittaErrorFilter implements ExceptionFilter {
  catch(exception: Error) {
    if (exception.name === 'RittaException') {
      throw rittaToNestError(exception as RittaError);
    }
    throw exception;
  }
}
