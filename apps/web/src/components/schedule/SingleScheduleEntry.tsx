import { Box, HoverCard, Text, Title } from "@mantine/core";
import dayjs from "dayjs";
import { inverseLerp } from "../../utils/numberUtils";
import { unixSinceMidnight } from "../../utils/timeUtils";

export interface Lesson {
  id: number;
  courseCode: string;
  courseName: string;
  startTime: Date;
  endTime: Date;
  room: string;
  teacher: string;
}

export interface SingleScheduleEntryProps {
  dayStart: number, // seconds since midnight
  dayEnd: number, // seconds since midnight
  lesson: Lesson,
  columnCount: number,
  column: number,
}

export default ({ dayStart, dayEnd, lesson, columnCount, column }: SingleScheduleEntryProps) => {
  const startPercentage = inverseLerp(dayStart, dayEnd, unixSinceMidnight(lesson.startTime)) * 100;
  const endPercentage = (1 - inverseLerp(dayStart, dayEnd, unixSinceMidnight(lesson.endTime))) * 100;

  const startTimeFormatted = dayjs(lesson.startTime).format("HH:mm");
  const endTimeFormatted = dayjs(lesson.endTime).format("HH:mm");
  const durationMinutes = dayjs(lesson.endTime).diff(lesson.startTime, "minute");

  return <HoverCard width={300} openDelay={500}>
    <HoverCard.Target>
      <Box sx={{
        border: "1px solid #ccc",
        padding: "0.5rem",
        position: "absolute",
        top: `${startPercentage}%`,
        bottom: `${endPercentage}%`,
        backgroundColor: "",
        width: `${100 / columnCount}%`,
        left: `${column * 100 / columnCount}%`,
      }}>
        <Text>{lesson.courseName}</Text>
      </Box>
    </HoverCard.Target>
    <HoverCard.Dropdown>
      <Title order={3}>{lesson.courseName} ({lesson.courseCode})</Title>
      <Text>{startTimeFormatted} to {endTimeFormatted} ({durationMinutes} minutes)</Text>
      <Text>{lesson.room}</Text>
      <Text>{lesson.teacher}</Text>
    </HoverCard.Dropdown>
  </HoverCard>
}
