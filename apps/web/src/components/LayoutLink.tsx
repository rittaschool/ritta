import { Anchor, Group, Text, ThemeIcon, UnstyledButton } from "@mantine/core";
import { ReactNode } from "react";
import { Link } from "react-router-dom";

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
        display: "block",
        width: "100%",
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        color:
          theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

        "&:hover": {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[6]
              : theme.colors.gray[0],
        },
      })}
    >
      <Anchor
        component={Link}
        to={to}
        sx={{
          color: "black",
          ":hover": {
            textDecoration: "none",
          },
        }}
      >
        <Group>
          <ThemeIcon color={color} variant="light">
            {icon}
          </ThemeIcon>

          <Text size="sm">{label}</Text>
        </Group>
      </Anchor>
    </UnstyledButton>
  );
}

export default LayoutLink;
