import {
  createStyles,
  Text,
  Avatar,
  Group,
  Timeline,
  Divider,
  Box,
  TypographyStylesProvider,
} from "@mantine/core";

const useStyles = createStyles((theme) => ({
  body: {
    paddingLeft: 54,
    paddingTop: theme.spacing.sm,
  },
}));

interface ThreadMessageProps {
  postedAt: string;
  body: string;
  author: {
    name: string;
    image: string;
  };
  isFirst: boolean;
}

export function ThreadMessage({
  postedAt,
  body,
  author,
  isFirst,
}: ThreadMessageProps) {
  const { classes } = useStyles();
  return (
    <div>
      {!isFirst && <Divider mb={40} />}
      <Group>
        <Avatar src={author.image} alt={author.name} radius="xl" />
        <div>
          <Text size="sm">{author.name}</Text>
          <Text size="xs" color="dimmed">
            {postedAt}
          </Text>
        </div>
      </Group>
      <TypographyStylesProvider>
        <Box
          className={classes.body}
          dangerouslySetInnerHTML={{ __html: body }}
          sx={{
            ["h1, h2, h3, h4, h5, h6, p"]: {
              marginTop: 0,
              marginBottom: 0,
            },
          }}
        ></Box>
      </TypographyStylesProvider>
    </div>
  );
}
