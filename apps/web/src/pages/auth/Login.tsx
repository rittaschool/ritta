import {
  Avatar,
  Button,
  Group,
  Stack,
  Stepper,
  Text,
  TextInput,
} from '@mantine/core';
import { Challenge } from '@rittaschool/shared';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AuthenticateInput from '../../components/AuthenticateInput';
import { useLoginStart } from '../../data/authentication';
import { EmailRegEx } from '../../utils/email.regex';

const Login = () => {
  const loginStartMutation = useLoginStart();
  const [active, setActive] = useState(0);
  const [emailError, setEmailError] = useState('');
  const nextStep = async () => {
    if (active == 0) {
      // make request starting login
      try {
        await loginStartMutation.mutateAsync(email);
      } catch (error) {}

      const { data, isError, error } = loginStartMutation;

      if (isError) {
        if (error.message === 'Network request failed')
          return setEmailError('Network Request failed. Check connection...');
        if (!error.response)
          return setEmailError('Not GraphQL error... Report to staff');

        // Set the error returned from api
        setEmailError(
          error.response.errors[0].message || 'Something went wrong'
        );
      }

      // Check if request was successful and required data is there
      const canContinue = data && data.startLoginProcess != null;

      if (!canContinue) return;

      setEmailError('');

      const { userFirstName, userPhotoUri, challenge } = data.startLoginProcess;

      setUserInfo({
        firstName: userFirstName,
        photo: userPhotoUri,
        challenge,
      });

      return setActive((current) => (current < 2 ? current + 1 : current));
    }
    setActive((current) => (current < 2 ? current + 1 : current));
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
    <>
      <Stepper active={active} onStepClick={setActive} breakpoint="sm">
        <Stepper.Step
          label="Step 1"
          description={t('auth:username')}
          allowStepSelect={active > 0}
          loading={loginStartMutation.isLoading}
        >
          <TextInput
            required
            label={t('auth:username')}
            placeholder="etunimi.sukunimi@ritta.app"
            value={email}
            onChange={(event) => {
              setEmailError('');
              setEmail(event.currentTarget.value);
            }}
            error={
              emailError ||
              (!EmailRegEx.test(email) && email && 'Invalid email')
            }
          />
        </Stepper.Step>
        <Stepper.Step
          label="Step 2"
          description="Authenticate"
          allowStepSelect={active > 1}
        >
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
            <Text>Please authenticate with</Text>
            <AuthenticateInput challengeType={userInfo.challenge?.type} />
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
    </>
  );
};

export default Login;
