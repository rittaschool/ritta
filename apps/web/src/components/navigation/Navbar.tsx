import {
  Navbar,
  Group,
  Code,
  ScrollArea,
  createStyles,
  Center,
  Button,
} from "@mantine/core";
import { Selector, Logout, Settings } from "tabler-icons-react";
import { UserButton } from "./UserButton";
import { LinksGroup } from "./NavbarLinksGroup";
// @ts-ignore
import Logo from "/static/logo.svg?component";
import { getNavigation } from "./navigation";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const useStyles = createStyles((theme) => ({
  navbar: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
    paddingBottom: 0,
    borderRight: 0,
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.03)",
  },

  header: {
    padding: theme.spacing.md,
    paddingTop: 0,
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
  },

  links: {
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
  },

  user: {
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderBottom: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]}`,
  },

  settings: {
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    borderTop: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]}`,
  },

  logOut: {
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
}));

export function NavbarNested({ hidden, isAdmin = false }: { hidden: boolean, isAdmin?: boolean }) {
  const { classes } = useStyles();
  const location = useLocation();
  const { t } = useTranslation();

  const links = getNavigation(location)
    .filter(link => isAdmin ? true : !link.requiresAdmin)
    .map((item) => (
      <LinksGroup {...item} isInAdminNavbar={isAdmin} key={item.label} />
    ));

  return (
    <Navbar
      width={{ md: 300 }}
      pt="md"
      px="md"
      className={classes.navbar}
      hidden={hidden}
    >
      <Navbar.Section className={classes.header}>
        <Group position="apart">
          <Logo width={120} />
          <Code sx={{ fontWeight: 700 }}>
            {import.meta.env.DEV ? "DEV " : "PROD "} {__COMMIT_HASH__}
          </Code>
        </Group>
      </Navbar.Section>

      <Navbar.Section className={classes.user}>
        <UserButton
          image="https://i.imgur.com/fGxgcDF.png"
          name={isAdmin ? "Antti Ylläpitäjä" : "Olli Opettaja"}
          title={isAdmin ? "Ylläpitäjä" : "Opettaja"}
          schoolName={isAdmin ? "Rittalan opetustoimi" : "Rittalan yhteiskoulu"}
          icon={<Selector size={14} />}
        />
      </Navbar.Section>

      <Navbar.Section grow className={classes.links} component={ScrollArea}>
        {links}
      </Navbar.Section>
      <Navbar.Section className={classes.settings}>
        <Center>
          <Button
            component={Link}
            to="/settings"
            variant="light"
            color="gray"
            sx={{ width: "80%" }}
          >
            <Settings style={{ marginRight: "5px" }} /> {t("navigation:settings")}
          </Button>
        </Center>
      </Navbar.Section>
      <Navbar.Section className={classes.logOut}>
        <Center>
          <Button
            component={Link}
            to="/auth/logout"
            variant="light"
            color="red"
            sx={{ width: "80%" }}
          >
            <Logout style={{ marginRight: "5px" }} /> {t("auth:log_out")}
          </Button>
        </Center>
      </Navbar.Section>
    </Navbar>
  );
}
