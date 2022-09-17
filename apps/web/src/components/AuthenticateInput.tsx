<<<<<<< HEAD
import { PasswordInput, Text } from "@mantine/core";
import { Challenge, IChallengeType } from "@rittaschool/shared";
import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { EyeCheck, EyeOff } from "tabler-icons-react";
=======
import { PasswordInput, Text } from '@mantine/core';
import { Challenge, IChallengeType } from '@rittaschool/shared';
import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { EyeCheck, EyeOff } from 'tabler-icons-react';
>>>>>>> 0c0319102984c8f5b3f4f64c87395aa00e17d3f0

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
<<<<<<< HEAD
            sx={{ width: "300px" }}
            visibilityToggleIcon={({ reveal, size }) =>
              reveal ? <EyeOff size={size} /> : <EyeCheck size={size} />
            }
            autoComplete="on"
            autoFocus
=======
            sx={{ width: '300px' }}
            visibilityToggleIcon={({ reveal, size }) =>
              reveal ? <EyeOff size={size} /> : <EyeCheck size={size} />
            }
>>>>>>> 0c0319102984c8f5b3f4f64c87395aa00e17d3f0
          />
        </>
      );

    default:
      return <Text>{t("auth:error.invalid_challenge_type")}</Text>;
  }
};

export default AuthenticateInput;
