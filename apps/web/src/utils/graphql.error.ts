export interface GraphQLError {
  message: string;
  response?: {
    errors: {
      message: string;
      extensions: {
        code: string;
        response: {
          statusCode: string;
          message: string;
          error: string;
        };
      };
    }[];
  };
}
