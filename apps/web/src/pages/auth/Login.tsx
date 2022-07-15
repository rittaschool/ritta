import {
  Group,
  TextInput,
  Button,
  PasswordInput,
  Anchor,
  Divider,
  Grid,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { GoogleButton } from "../../components/SocialButtons";

const Login = () => {
  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },
  });

  const { t } = useTranslation();

  return (
    <form onSubmit={form.onSubmit((values) => console.log(values))}>
      <TextInput
        label={t("auth:username")}
        required
        {...form.getInputProps("username")}
      />
      <PasswordInput
        label={t("auth:password")}
        required
        mt="md"
        {...form.getInputProps("password")}
      />
      <Group position="apart" mt="md">
        <Anchor<"a">
          onClick={(event) => event.preventDefault()}
          href="/auth/forgot"
          size="sm"
        >
          {t("auth:forgot_password")}
        </Anchor>
      </Group>
      <Button fullWidth mt="xl" type="submit">
        {t("auth:login")}
      </Button>
      <Divider label={t("auth:or_use")} labelPosition="center" my="lg" />
      <Grid grow mb="md" mt="md" gutter="md">
        <Grid.Col span={2}>
          <GoogleButton radius="xl">Google</GoogleButton>
        </Grid.Col>
      </Grid>
    </form>
  );
};

export default Login;
