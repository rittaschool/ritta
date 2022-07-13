import { Text, Box, useMantineTheme, Button, Center } from "@mantine/core";
import { Logout } from "tabler-icons-react";

export function HeaderLogout() {
  const theme = useMantineTheme();

  return (
    <Box
      sx={{
        paddingTop: theme.spacing.sm,
      }}
    >
      <Button variant="light" color="red">
        <Text size="sm" weight={500}>
          <Center>
            Kirjaudu ulos <Logout style={{ marginLeft: "5px" }} />
          </Center>
        </Text>
      </Button>
    </Box>
  );
}
