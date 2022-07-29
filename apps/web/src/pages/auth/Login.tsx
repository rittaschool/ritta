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
} from '@mantine/core';
import { Challenge } from '@rittaschool/shared';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AuthenticateInput from '../../components/AuthenticateInput';
import { submitChallenge, useLoginStart } from '../../data/authentication';

const Login = () => {
  const loginStartMutation = useLoginStart();
  const challengeMutation = submitChallenge();
  const [passwordInput, setPasswordInput] = useState('');
  const [active, setActive] = useState(0);
  const [emailError, setEmailError] = useState('');
  const nextStep = async () => {
    if (active == 0) {
      // make request starting login
      await loginStartMutation.mutateAsync(email, {
        onSuccess: (data) => {
          // Check if request was successful and required data is there
          const canContinue = data && data.startLoginProcess != null;

          if (!canContinue) return;

          setEmailError('');

          const { userFirstName, userPhotoUri, challenge } =
            data.startLoginProcess;

          setUserInfo({
            firstName: userFirstName,
            photo: userPhotoUri,
            challenge,
          });

          return setActive((current) => (current < 2 ? current + 1 : current));
        },
        onError: (error) => {
          if (error.message === 'Network request failed')
            return setEmailError('Network Request failed. Check connection...');
          if (!error.response)
            return setEmailError('Not GraphQL error... Report to staff');

          // Set the error returned from api
          setEmailError(
            error.response.errors[0].message || 'Something went wrong'
          );
        },
      });
    } else if (active == 1) {
      if (!userInfo.challenge) return console.error('NO CHALLENGE');

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
        }
      );
    }
  };
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [userInfo, setUserInfo] = useState<{
    firstName?: string;
    photo?: string;
    challenge?: Challenge;
  }>({});

  return (
    <Box
      sx={{
        position: 'relative',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <LoadingOverlay visible={loginStartMutation.isLoading} />

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
            Login with email
          </Title>
          <TextInput
            required
            label={t('auth:username')}
            placeholder="etunimi.sukunimi@ritta.app"
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
              alt="your profile picture"
              size="xl"
              src={userInfo.photo}
              sx={{
                borderRadius: 999,
              }}
            />
            <Text size={23}>Welcome, {userInfo.firstName}</Text>

            <AuthenticateInput
              passwordInput={passwordInput}
              setPasswordInput={setPasswordInput}
              challenge={userInfo.challenge}
            />
          </Stack>
        </Stepper.Step>
        <Stepper.Completed>
          Successfully logged in. Continue to dashboard
        </Stepper.Completed>
      </Stepper>

      <Group position="center" mt="xl">
        <Button variant="default" onClick={prevStep}>
          Back
        </Button>
        <Button onClick={nextStep}>Continue</Button>
      </Group>
    </Box>
  );
};

export default Login;
