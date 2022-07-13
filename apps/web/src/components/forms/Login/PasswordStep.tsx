import { Avatar, Button, Group, PasswordInput, Title } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form/lib/use-form';

export interface PasswordStepValues {
  password: string;
}

type Props = {
  form: UseFormReturnType<PasswordStepValues>;
  user: {
    firstName: string;
    photoUri: string;
  } | null;
  error?: string;
};

function SecondStep({ form, user, error }: Props) {
  console.log(error);
  return (
    <>
      {user && (
        <Group direction="column" align="center">
          <Avatar size="lg" src={user.photoUri} />
          <Title order={1}>Hei, {user.firstName}</Title>
        </Group>
      )}

      <PasswordInput
        size="md"
        required
        label="Salasana"
        placeholder="*******"
        error={error}
        {...form.getInputProps('password')}
      />

      <Group position="center" mt="xl" grow>
        <Button type="submit">Kirjaudu</Button>
      </Group>
    </>
  );
}

export default SecondStep;
