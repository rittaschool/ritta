import { DateResolver } from 'graphql-scalars';
import { createFromGraphQLScalar } from 'nest-graphql-scalar-adapter';

// Set descriptions for scalars
DateResolver.description = 'Date custom scalar type';

export const DateScalar = createFromGraphQLScalar({
  scalar: DateResolver,
});
