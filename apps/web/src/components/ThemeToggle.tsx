import { ActionIcon, useMantineColorScheme } from '@mantine/core';
import { Sun } from 'react-feather';
import { MoonStars } from 'tabler-icons-react';

type Props = {};

function ThemeToggle({}: Props) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  return (
    <ActionIcon
      variant="outline"
      color={dark ? 'yellow' : 'blue'}
      onClick={() => toggleColorScheme()}
      title="Toggle color scheme"
    >
      {dark ? <Sun size={18} /> : <MoonStars size={18} />}
    </ActionIcon>
  );
}

export default ThemeToggle;
