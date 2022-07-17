import {
  Avatar,
  Button,
  Group,
  Stack,
  Stepper,
  Text,
  TextInput,
} from '@mantine/core';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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

      console.log('NOT HERE', loginStartMutation);
      if (loginStartMutation.isError) {
        setEmailError(
          (loginStartMutation.error as any).response.errors[0].message ||
            'Something went wrong'
        );
      }

      const canContinue = loginStartMutation.data.startLoginProcess != null;

      if (!canContinue) return;
      return setActive((current) => (current < 2 ? current + 1 : current));
    }
    setActive((current) => (current < 2 ? current + 1 : current));
  };
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));
  const { t } = useTranslation();
  const [email, setEmail] = useState('');

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
            onChange={(event) => setEmail(event.currentTarget.value)}
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
              src="https://sndp.mediadelivery.fi/img/468/3a200fc3623944052600a6368c938066.jpg"
              sx={{
                borderRadius: 999,
              }}
            />
            <Text size={23}>Welcome, Roni Äikäs</Text>
            <Text>Please authenticate with</Text>
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
