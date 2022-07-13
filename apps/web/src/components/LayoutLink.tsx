import { Group, Text, ThemeIcon, UnstyledButton } from '@mantine/core';
import Link from 'next/link';
import { ReactNode } from 'react';

interface Props {
  icon: ReactNode;
  color: string;
  label: string;
  to: string;
}

function LayoutLink({ color, label, icon, to }: Props) {
  return (
    <UnstyledButton
      sx={(theme) => ({
        display: 'block',
        width: '100%',
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        color:
          theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

        '&:hover': {
          backgroundColor:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[6]
              : theme.colors.gray[0],
        },
      })}
    >
      <Link href={to} passHref>
        <Group>
          <ThemeIcon color={color} variant="light">
            {icon}
          </ThemeIcon>

          <Text size="sm" component="a">
            {label}
          </Text>
        </Group>
      </Link>
    </UnstyledButton>
  );
}

export default LayoutLink;
