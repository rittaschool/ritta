import { Center } from '@mantine/core';
import LoginForm from '../components/forms/Login';
import ThemeToggle from '../components/ThemeToggle';

type Props = {};
function test({}: Props) {
  return (
    <Center
      sx={() => ({
        height: '100vh',
      })}
    >
      <LoginForm />
    </Center>
  );
}
export default test;
