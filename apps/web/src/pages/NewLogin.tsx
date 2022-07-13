import {
  Box,
  Group,
  Paper,
  TextInput,
  Title,
  Button,
  Center,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/hooks";
import { useEffect, useRef, useState } from "react";
import Logo from "../components/Logo";
import useAuthentication from "../hooks/useAuthentication";

const Login = () => {
  const form = useForm({
    initialValues: {
      email: "",
    },
  });

  return (
    <Group
      align="center"
      grow
      pt={20}
      px={80}
      sx={() => ({
        position: "relative",
      })}
    >
      <Box
        sx={(theme) => ({
          display: "block",
          color:
            theme.colorScheme === "dark"
              ? theme.colors.blue[4]
              : theme.colors.blue[7],
          padding: theme.spacing.xl,
        })}
      >
        <Logo />
        <Group mt={50} direction="column">
          <Title order={2}>Tervetuloa käyttämään Rittaa</Title>
          <Text>
            Ritta on helppokäyttöinen ja monipuolinen koulujärjestelmä. <br />
            Tämän Ritta instanssin omistaa |insert name here|. <br />
            <br />
            Ongelmia sisäänkirjautumisessa? <br />
            Ota yhteyttä instanssin tukeen: |insert email here|.
          </Text>
        </Group>
      </Box>

      <Box
        mx="auto"
        px={50}
        sx={(theme) => ({
          position: "absolute",
          top: "50%",
          right: "50%", // 80px
          transform: "translate(50%)",
          flexGrow: 0,
          minWidth: "500px",
          display: "block",
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[6]
              : theme.colors.gray[0],
          color:
            theme.colorScheme === "dark"
              ? theme.colors.blue[4]
              : theme.colors.blue[7],
          padding: theme.spacing.xl,
          borderRadius: theme.radius.lg,
        })}
      >
        <Title order={2} align="center">
          Kirjaudu Sisään
        </Title>
        <Box mt="lg">
          <form onSubmit={form.onSubmit((values) => console.log(values))}>
            <TextInput
              size="md"
              required
              label="Käyttäjätunnus"
              placeholder="etunimi.sukunimi"
              {...form.getInputProps("email")}
            />

            <Group position="center" mt="xl" grow>
              <Button type="submit">Submit</Button>
            </Group>
          </form>
        </Box>
      </Box>
    </Group>
  );
};

export default Login;
