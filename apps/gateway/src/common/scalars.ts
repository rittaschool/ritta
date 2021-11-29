import {
  DateResolver,
  EmailAddressResolver,
  PhoneNumberResolver,
} from 'graphql-scalars';
import { createFromGraphQLScalar } from 'nest-graphql-scalar-adapter';

// Set descriptions for scalars
DateResolver.description = 'Date custom scalar type';
EmailAddressResolver.description = 'EmailAddress custom scalar type';
PhoneNumberResolver.description = 'PhoneNumber custom scalar type';

export const DateScalar = createFromGraphQLScalar({
  scalar: DateResolver,
});

export const EmailAddressScalar = createFromGraphQLScalar({
  scalar: EmailAddressResolver,
});

export const PhoneNumberScalar = createFromGraphQLScalar({
  scalar: PhoneNumberResolver,
});
