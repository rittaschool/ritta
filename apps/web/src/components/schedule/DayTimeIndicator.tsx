import { Box, useMantineTheme } from "@mantine/core";
import useRerender from "../../hooks/useRerender";
import { inverseLerp } from "../../utils/numberUtils";
import { unixSinceMidnight } from "../../utils/timeUtils";

export interface DayTimeIndicator {
  dayStart: number;
  dayEnd: number;
}

export default ({ dayStart, dayEnd }: DayTimeIndicator) => {
  const theme = useMantineTheme();

  // Has to be rerendered to update the position (it's based on time)
  useRerender(60000);

  const currentTime = unixSinceMidnight();
  const isWithinDay = currentTime >= dayStart && currentTime <= dayEnd;

  if (!isWithinDay) return null;

  return <Box
    sx={{
      position: "absolute",
      width: "100%",
      borderTop: `4px solid ${theme.colors.teal[8]}`,
      top: `${100 * inverseLerp(dayStart, dayEnd, currentTime)}%`
    }} />;
}
