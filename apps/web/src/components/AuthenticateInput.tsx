import { PasswordInput, Text } from '@mantine/core';
import { IChallengeType } from '@rittaschool/shared';
import { EyeCheck, EyeOff } from 'tabler-icons-react';

type Props = {
  challengeType?: IChallengeType;
};

const AuthenticateInput = ({ challengeType }: Props) => {
  switch (challengeType) {
    case IChallengeType.PASSWORD_NEEDED:
      return (
        <PasswordInput
          label="Password"
          placeholder="Change visibility toggle icon"
          defaultValue=""
          visibilityToggleIcon={({ reveal, size }) =>
            reveal ? <EyeOff size={size} /> : <EyeCheck size={size} />
          }
        />
      );

    default:
      return <Text>Invalid Challenge Type</Text>;
  }
};

export default AuthenticateInput;
