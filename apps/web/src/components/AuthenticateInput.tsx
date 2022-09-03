import { PasswordInput, Text } from '@mantine/core';
import { Challenge, IChallengeType } from '@rittaschool/shared';
import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

  if (!challenge) return <Text>{t("auth:error.invalid_challenge")}</Text>;

  switch (challenge.type) {
    case IChallengeType.PASSWORD_NEEDED:
      return (
        <>
          <Text>{t("auth:login_method.password.prompt")}</Text>
          <PasswordInput
            label={t("auth:password")}
            placeholder={t("auth:password")}
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
      return <Text>{t("auth:error.invalid_challenge_type")}</Text>;
  }
};

export default AuthenticateInput;
