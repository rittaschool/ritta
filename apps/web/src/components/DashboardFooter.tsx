import {
  createStyles,
  Anchor,
  Group,
  ActionIcon,
  useMantineColorScheme,
} from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import { ReactElement, useEffect, useState } from "react";
import { BrandTwitter, BrandYoutube, BrandInstagram } from "tabler-icons-react";
// @ts-ignore
import Logo from "/static/logo.svg?component";

const useStyles = createStyles((theme) => ({
  footer: {
    marginTop: 120,
    borderTop: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
  },

  inner: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    padding: `${theme.spacing.md}px ${theme.spacing.md}px`,

    [theme.fn.smallerThan("sm")]: {
      flexDirection: "column",
    },
  },

  links: {
    [theme.fn.smallerThan("sm")]: {
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.sm,
    },
  },
}));

interface DashboardFooterProps {
  links: { link: string; label: string }[];
}

export function DashboardFooter({ links }: DashboardFooterProps) {
  const { classes } = useStyles();
  const scheme = useMantineColorScheme();
  const [items, setItems] = useState<ReactElement[]>([]);

  useEffect(() => {
    setItems(
      links.map((link) => (
        <Anchor<"a">
          key={link.label}
          href={link.link}
          sx={{
            lineHeight: 1,
            color: scheme.colorScheme === "dark" ? "white" : "black",
          }}
          onClick={(event) => event.preventDefault()}
          size="sm"
        >
          {link.label}
        </Anchor>
      ))
    );
  }, [scheme]);

  return (
    <div className={classes.footer}>
      <div className={classes.inner}>
        <Logo height={32} />

        <Group className={classes.links}>{items}</Group>
      </div>
    </div>
  );
}
