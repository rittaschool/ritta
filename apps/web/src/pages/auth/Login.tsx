import {
  Avatar,
  Box,
  Button,
  Group,
  LoadingOverlay,
  Stack,
  Stepper,
  Text,
  TextInput,
  Title,
<<<<<<< HEAD
} from "@mantine/core";
import { Challenge } from "@rittaschool/shared";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import AuthenticateInput from "../../components/AuthenticateInput";
import { submitChallenge, useLoginStart } from "../../data/authentication";
=======
} from '@mantine/core';
import { Challenge } from '@rittaschool/shared';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AuthenticateInput from '../../components/AuthenticateInput';
import { submitChallenge, useLoginStart } from '../../data/authentication';
>>>>>>> 0c0319102984c8f5b3f4f64c87395aa00e17d3f0

const Login = () => {
  const loginStartMutation = useLoginStart();
  const challengeMutation = submitChallenge();
<<<<<<< HEAD
  const navigate = useNavigate();
  const [passwordInput, setPasswordInput] = useState("");
  const [active, setActive] = useState(0);
  const [emailError, setEmailError] = useState("");
=======
  const [passwordInput, setPasswordInput] = useState('');
  const [active, setActive] = useState(0);
  const [emailError, setEmailError] = useState('');
>>>>>>> 0c0319102984c8f5b3f4f64c87395aa00e17d3f0
  const nextStep = async () => {
    if (active == 0) {
      // make request starting login
      await loginStartMutation.mutateAsync(email, {
<<<<<<< HEAD
        onSuccess: (data: any) => {
=======
        onSuccess: (data) => {
>>>>>>> 0c0319102984c8f5b3f4f64c87395aa00e17d3f0
          // Check if request was successful and required data is there
          const canContinue = data && data.startLoginProcess != null;

          if (!canContinue) return;

<<<<<<< HEAD
          setEmailError("");
=======
          setEmailError('');
>>>>>>> 0c0319102984c8f5b3f4f64c87395aa00e17d3f0

          const { userFirstName, userPhotoUri, challenge } =
            data.startLoginProcess;

          setUserInfo({
            firstName: userFirstName,
            photo: userPhotoUri,
            challenge,
          });

          return setActive((current) => (current < 2 ? current + 1 : current));
        },
<<<<<<< HEAD
        onError: (error: any) => {
          // TODO: set email error based on the error code (not message)
          if (error.message === "Network request failed")
=======
        onError: (error) => {
          // TODO: set email error based on the error code (not message)
          if (error.message === 'Network request failed')
>>>>>>> 0c0319102984c8f5b3f4f64c87395aa00e17d3f0
            return setEmailError(t("auth:error.network"));
          if (!error.response)
            return setEmailError(t("auth:error.not_graphql"));

          const errors = error.response.errors;
          if (errors && errors.length > 0 && errors[0]) {
            const errorCode = errors[0].extensions.code;
            if (errorCode === "BAD_USER_INPUT") {
              return setEmailError(t("auth:error.bad_user_input"));
            }

            return setEmailError(errors[0].message);
          }

          return setEmailError(t("auth:error.unknown"));
        },
      });
    } else if (active == 1) {
<<<<<<< HEAD
      if (!userInfo.challenge) return console.error("NO CHALLENGE");
=======
      if (!userInfo.challenge) return console.error('NO CHALLENGE');
>>>>>>> 0c0319102984c8f5b3f4f64c87395aa00e17d3f0

      await challengeMutation.mutateAsync(
        {
          ...userInfo.challenge,
          data: {
            passwordData: {
              password: passwordInput,
            },
          },
        },
        {
<<<<<<< HEAD
          onSuccess: (data: any) => {
            const { access_token, refresh_token } = data.submitChallenge;
            if (access_token) {
              sessionStorage.setItem("access_token", access_token);
            }
            if (refresh_token) {
              sessionStorage.setItem("refresh_token", refresh_token);
            }
            navigate("/");
          },
          onError: (err: any) => console.log("ERROR", err),
=======
          onSuccess: (data) => {
            const { access_token, refresh_token } = data.submitChallenge;
            if (access_token) {
              sessionStorage.setItem('access_token', access_token);
            }
            if (refresh_token) {
              sessionStorage.setItem('refresh_token', refresh_token);
            }
          },
          onError: (err) => console.log('ERROR', err),
>>>>>>> 0c0319102984c8f5b3f4f64c87395aa00e17d3f0
        }
      );
    }
  };
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));
  const { t } = useTranslation();
<<<<<<< HEAD
  const [email, setEmail] = useState("");
=======
  const [email, setEmail] = useState('');
>>>>>>> 0c0319102984c8f5b3f4f64c87395aa00e17d3f0
  const [userInfo, setUserInfo] = useState<{
    firstName?: string;
    photo?: string;
    challenge?: Challenge;
  }>({});

  return (
    <Box
      sx={{
<<<<<<< HEAD
        position: "relative",
        flex: 1,
        display: "flex",
        flexDirection: "column",
=======
        position: 'relative',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
>>>>>>> 0c0319102984c8f5b3f4f64c87395aa00e17d3f0
      }}
    >
      <LoadingOverlay visible={loginStartMutation.isLoading} />

<<<<<<< HEAD
      <form
        onSubmit={(e: any) => {
          e.preventDefault();
          nextStep();
        }}
      >
        <Stepper
          active={active}
          onStepClick={setActive}
          breakpoint="sm"
          styles={{
            steps: {
              display: "none",
            },
          }}
          sx={{
            flex: "1",
          }}
        >
          <Stepper.Step allowStepSelect={active > 0}>
            <Title order={3} align="center" mb="md">
              {t("auth:login_method.email")}
            </Title>
            <TextInput
              required
              label={t("auth:username")}
              placeholder={t("auth:placeholder.username")}
              value={email}
              onChange={(event) => {
                setEmailError("");
                setEmail(event.currentTarget.value);
              }}
              error={emailError}
            />
          </Stepper.Step>
          <Stepper.Step allowStepSelect={active > 1}>
            <Stack align="center">
              <Avatar
                alt={t("profile_picture_alt_text")}
                size="xl"
                src={userInfo.photo}
                sx={{
                  borderRadius: 999,
                }}
              />
              <Text size={23}>
                {t("auth:greeting", { firstName: userInfo.firstName })}
              </Text>

              <AuthenticateInput
                passwordInput={passwordInput}
                setPasswordInput={setPasswordInput}
                challenge={userInfo.challenge}
              />
            </Stack>
          </Stepper.Step>
          <Stepper.Completed>{t("auth:login_success")}</Stepper.Completed>
        </Stepper>
      </form>
      <Group position="center" mt="xl">
        {active > 0 && (
          <Button variant="default" onClick={prevStep}>
            {t("auth:button.back")}
          </Button>
        )}
=======
      <Stepper
        active={active}
        onStepClick={setActive}
        breakpoint="sm"
        styles={{
          steps: {
            display: 'none',
          },
        }}
        sx={{
          flex: '1',
        }}
      >
        <Stepper.Step allowStepSelect={active > 0}>
          <Title order={3} align="center" mb="md">
            {t("auth:login_method.email")}
          </Title>
          <TextInput
            required
            label={t('auth:username')}
            placeholder={t("auth:placeholder.username")}
            value={email}
            onChange={(event) => {
              setEmailError('');
              setEmail(event.currentTarget.value);
            }}
            error={emailError}
          />
        </Stepper.Step>
        <Stepper.Step allowStepSelect={active > 1}>
          <Stack align="center">
            <Avatar
              alt={t("profile_picture_alt_text")}
              size="xl"
              src={userInfo.photo}
              sx={{
                borderRadius: 999,
              }}
            />
            <Text size={23}>{t("auth:greeting", { firstName: userInfo.firstName })}</Text>

            <AuthenticateInput
              passwordInput={passwordInput}
              setPasswordInput={setPasswordInput}
              challenge={userInfo.challenge}
            />
          </Stack>
        </Stepper.Step>
        <Stepper.Completed>
          {t("auth:login_success")}
        </Stepper.Completed>
      </Stepper>

      <Group position="center" mt="xl">
        <Button variant="default" onClick={prevStep}>
          {t("auth:button.back")}
        </Button>
>>>>>>> 0c0319102984c8f5b3f4f64c87395aa00e17d3f0
        <Button onClick={nextStep}>{t("auth:button.continue")}</Button>
      </Group>
    </Box>
  );
};

export default Login;
