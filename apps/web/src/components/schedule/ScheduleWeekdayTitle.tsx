import { Stack, Text, Title, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Dayjs } from "dayjs";
import { useTranslation } from "react-i18next";

export default ({ day }: { day: Dayjs }) => {
  const { i18n } = useTranslation();
  const isMobile = useMediaQuery("(max-width: 576px)");
  const theme = useMantineTheme();

  const weekdayOptions: Intl.DateTimeFormatOptions = isMobile ? { weekday: "short" } : { weekday: "long" };
  const dateOptions: Intl.DateTimeFormatOptions = isMobile ? { month: "numeric", day: "numeric" } : { month: "short", day: "numeric" };

  return <Title
    order={2}
    sx={{ flex: 1 }}
    align="center"
  >
    <Stack spacing={0}>
      <Text sx={{
        lineHeight: 1,
        fontSize: 34,
        [theme.fn.smallerThan("lg")]: {
          fontSize: 28,
        },
        [theme.fn.smallerThan("md")]: {
          fontSize: 24,
        },
        [theme.fn.smallerThan("sm")]: {
          fontSize: 20,
        },
        [theme.fn.smallerThan("xs")]: {
          fontSize: 16,
        }
      }}>
        {day.toDate().toLocaleDateString(i18n.language, dateOptions)}
      </Text>
      <Text size="md">
        {day.toDate().toLocaleDateString(i18n.language, weekdayOptions)}
      </Text>
    </Stack>
  </Title>;
}
