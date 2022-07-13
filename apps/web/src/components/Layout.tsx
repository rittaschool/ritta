import {
  AppShell,
  Burger,
  Center,
  Header,
  MediaQuery,
  useMantineTheme,
  Navbar as MantineNavbar,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { ReactNode, useState } from "react";
import { Calendar, File, GitMerge, Home } from "react-feather";
import { Messages } from "tabler-icons-react";
import { NavbarNested as Navbar } from "./navigation/Navbar";
import Logo from "./Logo";

// Links
const links = [
  { icon: <Home size={16} />, color: "teal", label: "Koti", to: "/" },
  {
    icon: <Messages size={16} />,
    color: "orange",
    label: "Viestit",
    to: "/messages",
  },
  {
    icon: <Calendar size={16} />,
    color: "red",
    label: "Työjärjestys",
    to: "/schedule",
  },
  { icon: <File size={16} />, color: "grape", label: "Kokeet", to: "/tests" },
];

export default function Layout({ children }: { children: ReactNode }) {
  const [opened, setOpened] = useState(false);
  const theme = useMantineTheme();
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <AppShell
      // navbarOffsetBreakpoint controls when navbar should no longer be offset with padding-left
      navbarOffsetBreakpoint="sm"
      // fixed prop on AppShell will be automatically added to Header and Navbar
      fixed
      navbar={<Navbar hidden={!opened} />}
      header={
        <MediaQuery largerThan="sm" styles={{ display: "none" }}>
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
              />
              {isMobile ? (
                <MantineNavbar.Section grow>
                  <Center>
                    <a href="/">
                      <Logo />
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
        paddingLeft: "20px",
      }}
    >
      {children}
    </AppShell>
  );
}
