import { HoverCard, Paper, Text, Title, useMantineColorScheme, useMantineTheme } from "@mantine/core";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
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
  hoveredCourseCode: string | null,
  setHoveredCourseCode: (courseCode: string | null) => void,
}

export default ({
  dayStart,
  dayEnd,
  lesson,
  columnCount,
  column,
  hoveredCourseCode,
  setHoveredCourseCode
}: SingleScheduleEntryProps) => {
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const { t } = useTranslation();

  const startPercentage = inverseLerp(dayStart, dayEnd, unixSinceMidnight(lesson.startTime)) * 100;
  const endPercentage = (1 - inverseLerp(dayStart, dayEnd, unixSinceMidnight(lesson.endTime))) * 100;

  const startTimeFormatted = dayjs(lesson.startTime).format("HH:mm");
  const endTimeFormatted = dayjs(lesson.endTime).format("HH:mm");
  const durationMinutes = dayjs(lesson.endTime).diff(lesson.startTime, "minute");

  return <HoverCard width={300} openDelay={500}>
    <HoverCard.Target>
      <Paper
        onMouseOver={() => setHoveredCourseCode(lesson.courseCode)}
        onMouseOut={() => setHoveredCourseCode(null)}
        sx={{
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: colorScheme === "light" ? theme.colors.gray[5] : theme.colors.dark[1],
          padding: "0.5rem",
          position: "absolute",
          top: `${startPercentage}%`,
          bottom: `${endPercentage}%`,
          backgroundColor: colorScheme === "light" ?
            (hoveredCourseCode === lesson.courseCode ? "#E6E6E6" : "#f9f9f9") :
            (hoveredCourseCode === lesson.courseCode ? "#45464B" : "#2c2d32"),
          width: `${100 / columnCount}%`,
          left: `${column * 100 / columnCount}%`,
          zIndex: 10
        }}
      >
        <Text>{lesson.courseName}</Text>
      </Paper>
    </HoverCard.Target>
    <HoverCard.Dropdown sx={{
      backgroundColor: theme.fn.rgba(colorScheme === "light" ? theme.colors.gray[1] : "#2c2d32", 0.5),
      boxShadow: theme.shadows.xl,
      borderLeft: `4px solid ${theme.colors.teal[6]}`,
      backdropFilter: "blur(16px)",
      padding: 15
    }}>
      <Title order={3}>{lesson.courseName} ({lesson.courseCode})</Title>
      <Text>{startTimeFormatted}-{endTimeFormatted} ({t("common:minutes", { count: durationMinutes })})</Text>
      <Text>{lesson.room}</Text>
      <Text>{lesson.teacher}</Text>
    </HoverCard.Dropdown>
  </HoverCard>
}
