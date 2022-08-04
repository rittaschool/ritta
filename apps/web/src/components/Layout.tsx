import {
  AppShell,
  Burger,
  Center,
  Header,
  MediaQuery,
  useMantineTheme,
  Navbar as MantineNavbar,
  useMantineColorScheme,
  Box,
  Stack,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { ReactNode, useEffect, useState } from "react";
import { NavbarNested as Navbar } from "./navigation/Navbar";
import Logo from "./Logo";
import { DashboardFooter } from "./DashboardFooter";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Layout({ children, isAdmin }: { children: ReactNode, isAdmin: boolean }) {
  const [opened, setOpened] = useState(false);
  const theme = useMantineTheme();
  const isMobile = useMediaQuery("(max-width: 992px)");
  const colorScheme = useMantineColorScheme();

  const location = useLocation();

  const { t } = useTranslation();
  useEffect(() => {
    if (opened === true) setTimeout(() => setOpened(false), 100);
  }, [location]);

  return (
    <AppShell
      // navbarOffsetBreakpoint controls when navbar should no longer be offset with padding-left
      navbarOffsetBreakpoint="md"
      // fixed prop on AppShell will be automatically added to Header and Navbar
      fixed
      navbar={<Navbar hidden={!opened} isAdmin={isAdmin} />}
      header={
        <MediaQuery largerThan="md" styles={{ display: "none" }}>
          <Header height={isMobile ? 70 : 0}>
            {/* Handle other responsive styles with MediaQuery component or createStyles function */}
            <div
              style={{ display: "flex", alignItems: "center", height: "100%" }}
            >
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                sx={{ marginLeft: "16px" }}
                mr="xl"
                aria-label={t(
                  opened
                    ? "navigation:aria_close_navigation"
                    : "navigation:aria_open_navigation"
                )}
              />
              {isMobile ? (
                <MantineNavbar.Section grow>
                  <Center>
                    <a href="/" aria-label={t("navigation:aria_logo")}>
                      <Logo center={true} />
                    </a>
                  </Center>
                </MantineNavbar.Section>
              ) : (
                <></>
              )}
              <div style={{ width: "63px" }} />
            </div>
          </Header>
        </MediaQuery>
      }
      sx={{
        backgroundColor: colorScheme.colorScheme === "dark" ? "" : "#fafdfb",
      }}
    >
      <Stack justify="space-between" sx={{ height: "100%" }}>
        <Box>{children}</Box>
        <DashboardFooter
          links={[
            {
              label: "Tietosuojaseloste",
              link: "https://ritta.fi/privacy",
            },
            {
              label: "Käyttöehdot",
              link: "https://ritta.fi/tos",
            },
            {
              label: "Saavutettavuusseloste",
              link: "https://ritta.fi/accesibility",
            },
            {
              label: "Tuki",
              link: "https://ritta.fi/",
            },
          ]}
        />
      </Stack>
    </AppShell>
  );
}
