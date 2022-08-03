import { Box, Text } from "@mantine/core";
import dayjs from "dayjs";
import { inverseLerp } from "../../utils/numberUtils";
import { unixSinceMidnight } from "../../utils/timeUtils";

export interface Lesson {
  id: number;
  courseName: string;
  startTime: Date;
  endTime: Date;
}

export interface SingleScheduleEntryProps {
  dayStart: number, // seconds since midnight
  dayEnd: number, // seconds since midnight
  lesson: Lesson
}

export default ({ dayStart, dayEnd, lesson }: SingleScheduleEntryProps) => {
  const startPercentage = inverseLerp(dayStart, dayEnd, unixSinceMidnight(lesson.startTime)) * 100;
  const endPercentage = (1 - inverseLerp(dayStart, dayEnd, unixSinceMidnight(lesson.endTime))) * 100;

  const startTimeFormatted = dayjs(lesson.startTime).format("HH:mm");
  const endTimeFormatted = dayjs(lesson.endTime).format("HH:mm");

  return <Box sx={{
    border: "1px solid #ccc",
    padding: "0.5rem",
    position: "absolute",
    top: `${startPercentage}%`,
    bottom: `${endPercentage}%`,
    backgroundColor: "",
    width: "100%",
  }}>
    <Text>{lesson.courseName} ({startTimeFormatted} to {endTimeFormatted})</Text>
  </Box>;
}
