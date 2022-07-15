import {
  TextInput,
  PasswordInput,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
  Badge,
  Stack,
  Space,
  Select,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import Logo from "./Logo";
import Languages from "../../locales/locales.json";
import { ReactElement, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

export default function App({ children }: { children: JSX.Element }) {
  const languages: {
    [key: string]: string;
  } = Languages;

  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState("");

  useEffect(() => {
    if (lang || lang !== "") {
      i18n.changeLanguage(lang);
    }
  }, [lang]);

  return (
    <>
      <Container size={420} my={40}>
        <Title
          align="center"
          sx={(theme) => ({
            fontFamily: `Greycliff CF, ${theme.fontFamily}`,
            fontWeight: 900,
            marginBottom: "25px",
          })}
        >
          <Stack spacing="sm">
            <Logo center={true} />
            <Badge color="teal" size="xl" variant="filled">
              {t("auth:stage")}
            </Badge>
          </Stack>
        </Title>
        <Text color="dimmed" size="sm" align="center" mt={5}>
          {t("auth:info.operated", { name: "Rittalan yhtenäiskoulu" })}
          <Space />
          {t("auth:info.for_support")}{" "}
          <Anchor<"a">
            href="https://ritta.fi"
            size="sm"
            onClick={(event) => event.preventDefault()}
          >
            {t("auth:info.support_center")}
          </Anchor>
        </Text>

        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          {children}
        </Paper>
      </Container>
      <Container size={420} my={20}>
        <Paper withBorder shadow="md" p={30} pt={25} mt={30} radius="md">
          <Select
            label={"Change language"}
            value={lang || i18n.language}
            data={Object.keys(languages).map((languageId) => ({
              value: languageId,
              label: languages[languageId],
            }))}
            onChange={(lang) => setLang(lang || "fi")}
          />
        </Paper>
      </Container>
    </>
  );
}