import { Paper, Stack, Title, useMantineColorScheme, useMantineTheme } from "@mantine/core";
import dayjs, { Dayjs } from "dayjs";
import { getColumns as calculateColumns } from "../../utils/scheduleUtils";
import DayTimeIndicator from "./DayTimeIndicator";
import SingleScheduleEntry, { Lesson } from "./SingleScheduleEntry";

export interface ScheduleDayProps {
  day: Dayjs,
  dayStart: number,
  dayEnd: number,
  lessons: Lesson[],
  hoveredCourseCode: string | null,
  setHoveredCourseCode: (courseCode: string | null) => void,
}

export default ({
  day,
  dayStart,
  dayEnd,
  lessons,
  hoveredCourseCode,
  setHoveredCourseCode
}: ScheduleDayProps) => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  const lessonsWithColumn = calculateColumns(lessons);
  const columnCount = Math.max(...lessonsWithColumn.map(o => o.column)) + 1;

  const isToday = day.isSame(dayjs(), "day");

  return <Stack sx={{ flex: 1 }}>
    <Title order={2}>{day.format("D.M.YYYY")}</Title>
    <Paper sx={{
      backgroundColor: colorScheme === "light" ? theme.colors.gray[1] : theme.colors.dark[6],
      padding: 5
    }}>
      <div style={{ height: 550, position: "relative" }}>
        {lessonsWithColumn.map(lesson => <SingleScheduleEntry
          key={lesson.id}
          dayStart={dayStart}
          dayEnd={dayEnd}
          lesson={lesson}
          columnCount={columnCount}
          column={lesson.column}
          hoveredCourseCode={hoveredCourseCode}
          setHoveredCourseCode={setHoveredCourseCode}
        />)}
        {isToday && <DayTimeIndicator dayStart={dayStart} dayEnd={dayEnd} />}
      </div>
    </Paper>
  </Stack>;
}
