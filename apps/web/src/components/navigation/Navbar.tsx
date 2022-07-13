import {
  Navbar,
  Group,
  Code,
  ScrollArea,
  createStyles,
  Center,
  Button,
} from "@mantine/core";
import { Selector, Logout } from "tabler-icons-react";
import { UserButton } from "./UserButton";
import { LinksGroup } from "./NavbarLinksGroup";
// @ts-ignore
import Logo from "../../../static/logo.svg?component";
import { getNavigation } from "./navigation";

const useStyles = createStyles((theme) => ({
  navbar: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
    paddingBottom: 0,
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
    borderBottom: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },

  logOut: {
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    borderTop: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },
}));

export function NavbarNested({ hidden }: { hidden: boolean }) {
  const { classes } = useStyles();
  const links = getNavigation().map((item) => (
    <LinksGroup {...item} key={item.label} />
  ));

  return (
    <Navbar
      width={{ sm: 300 }}
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
          name="Olli Opettaja"
          title="Opettaja"
          schoolName="Rittalan yhteiskoulu"
          icon={<Selector size={14} />}
        />
      </Navbar.Section>

      <Navbar.Section grow className={classes.links} component={ScrollArea}>
        {links}
      </Navbar.Section>
      <Navbar.Section className={classes.logOut}>
        <Center>
          <Button variant="light" color="red" sx={{ width: "80%" }}>
            Kirjaudu ulos <Logout style={{ marginLeft: "5px" }} />
          </Button>
        </Center>
      </Navbar.Section>
    </Navbar>
  );
}
