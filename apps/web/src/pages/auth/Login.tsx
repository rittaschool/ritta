import { Avatar, Button, Group, Stepper, TextInput } from '@mantine/core';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EmailRegEx } from '../../utils/email.regex';

const Login = () => {
  const [active, setActive] = useState(1);
  const nextStep = () =>
    setActive((current) => (current < 2 ? current + 1 : current));
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
        >
          <TextInput
            required
            label={t('auth:username')}
            placeholder="etunimi.sukunimi@ritta.app"
            value={email}
            onChange={(event) => setEmail(event.currentTarget.value)}
            error={!EmailRegEx.test(email) && email && 'Invalid email'}
          />
        </Stepper.Step>
        <Stepper.Step
          label="Step 2"
          description="Authenticate"
          allowStepSelect={active > 1}
        >
          <Avatar alt="your profile picture" />
          Authenticate with password or security key or push notification
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
