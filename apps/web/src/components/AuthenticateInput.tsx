import { PasswordInput, Text } from '@mantine/core';
import { Challenge, IChallengeType } from '@rittaschool/shared';
import { Dispatch, SetStateAction } from 'react';
import { EyeCheck, EyeOff } from 'tabler-icons-react';

type Props = {
  challenge?: Challenge;
  passwordInput: string;
  setPasswordInput: Dispatch<SetStateAction<string>>;
};

const AuthenticateInput = ({
  challenge,
  passwordInput,
  setPasswordInput,
}: Props) => {
  if (!challenge) return <Text>Invalid Challenge</Text>;

  switch (challenge.type) {
    case IChallengeType.PASSWORD_NEEDED:
      return (
        <>
          <Text>Please authenticate with your password.</Text>
          <PasswordInput
            label="Password"
            placeholder="Password"
            value={passwordInput}
            onChange={(event) => setPasswordInput(event.target.value)}
            sx={{ width: '300px' }}
            visibilityToggleIcon={({ reveal, size }) =>
              reveal ? <EyeOff size={size} /> : <EyeCheck size={size} />
            }
          />
        </>
      );

    default:
      return <Text>Invalid Challenge Type</Text>;
  }
};

export default AuthenticateInput;
