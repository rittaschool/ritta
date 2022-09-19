import { GraphQLScalarType, Kind } from 'graphql';
import {
  DateResolver,
  EmailAddressResolver,
  PhoneNumberResolver,
  JSONResolver,
} from 'graphql-scalars';
import { createFromGraphQLScalar } from 'nest-graphql-scalar-adapter';

// Set descriptions for scalars
DateResolver.description = 'Date custom scalar type';
EmailAddressResolver.description = 'EmailAddress custom scalar type';
PhoneNumberResolver.description = 'PhoneNumber custom scalar type';
JSONResolver.description = 'JSON custom scalar type';

export const DateScalar = createFromGraphQLScalar({
  scalar: DateResolver,
});

export const TimestampScalar = createFromGraphQLScalar({
  scalar: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    serialize(value: Date) {
      return value.getTime(); // Convert outgoing Date to integer for JSON
    },
    parseValue(value: number) {
      return new Date(value); // Convert incoming integer to Date
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return new Date(parseInt(ast.value, 10)); // Convert hard-coded AST string to integer and then to Date
      }
      return null; // Invalid hard-coded value (not an integer)
    },
  }),
});

export const EmailAddressScalar = createFromGraphQLScalar({
  scalar: EmailAddressResolver,
});

export const PhoneNumberScalar = createFromGraphQLScalar({
  scalar: PhoneNumberResolver,
});

export const JSONScalar = createFromGraphQLScalar({
  scalar: JSONResolver,
});
