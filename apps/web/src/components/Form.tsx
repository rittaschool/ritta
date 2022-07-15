import { Box } from '@mantine/core';

interface FormProps {
  children: JSX.Element;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const Form: React.FC<FormProps> = ({ children, onSubmit }) => {
  return (
    <Box
      sx={(theme) => ({
        flexGrow: 0,
        minWidth: '500px',
        minHeight: '500px',
        display: 'block',
        backgroundColor:
          theme.colorScheme === 'dark'
            ? theme.colors.dark[6]
            : theme.colors.gray[1],
        color:
          theme.colorScheme === 'dark'
            ? theme.colors.blue[4]
            : theme.colors.blue[7],
        padding: theme.spacing.xl,
        borderRadius: theme.radius.lg,
        position: 'relative',
      })}
    >
      <form onSubmit={onSubmit}>{children}</form>
    </Box>
  );
};

export default Form;
