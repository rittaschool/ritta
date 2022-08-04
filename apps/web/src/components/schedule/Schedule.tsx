import { Group, Stack, Text, Title, useMantineColorScheme } from "@mantine/core";
import dayjs from "dayjs";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { unixSinceMidnight } from "../../utils/timeUtils";
import HourLine from "./HourLine";
import ScheduleDay from "./ScheduleDay";
import { Lesson } from "./SingleScheduleEntry";

const TIME_WIDTH = 50;

interface ScheduleProps {
  lessons?: Lesson[],
  minStartTime: number, // seconds since midnight
  minEndTime: number, // seconds since midnight
  minorHourLines?: number // how many minor hour lines are between each major hour line
}

// TODO: Remove these default props, they are only for development
const defaultLessons: Lesson[] = [
  {
    id: 0,
    courseCode: "MAT-2",
    courseName: "Maths",
    startTime: new Date(2022, 7, 2, 9, 30, 0),
    endTime: new Date(2022, 7, 2, 10, 30, 0),
    room: "A2",
    teacher: "Minna Muuttuja"
  },
  {
    id: 1,
    courseCode: "MAT-1",
    courseName: "Maths",
    startTime: new Date(2022, 7, 3, 9, 0, 0),
    endTime: new Date(2022, 7, 3, 10, 0, 0),
    room: "A1",
    teacher: "Matti Matemaatikko"
  },
  {
    id: 2,
    courseCode: "MAT-2",
    courseName: "Maths",
    startTime: new Date(2022, 7, 3, 13, 30, 0),
    endTime: new Date(2022, 7, 3, 14, 30, 0),
    room: "A2",
    teacher: "Minna Muuttuja"
  },
  {
    id: 3,
    courseCode: "PHY-1",
    courseName: "Physics",
    startTime: new Date(2022, 7, 4, 8, 30, 0),
    endTime: new Date(2022, 7, 4, 9, 45, 0),
    room: "A3",
    teacher: "Frans Fyysikko"
  },
  {
    id: 4,
    courseCode: "CHE-1",
    courseName: "Chemistry",
    startTime: new Date(2022, 7, 3, 9, 30, 0),
    endTime: new Date(2022, 7, 3, 10, 45, 0),
    room: "A4",
    teacher: "Kaisa Kemisti"
  },
  {
    id: 5,
    courseCode: "CHE-1",
    courseName: "Chemistry",
    startTime: new Date(2022, 7, 1, 11, 30, 0),
    endTime: new Date(2022, 7, 1, 12, 45, 0),
    room: "A4",
    teacher: "Kaisa Kemisti"
  },
  {
    id: 6,
    courseCode: "PHY-1",
    courseName: "Physics",
    startTime: new Date(2022, 7, 5, 11, 30, 0),
    endTime: new Date(2022, 7, 5, 12, 45, 0),
    room: "A3",
    teacher: "Frans Fyysikko"
  },
];

export default ({
  lessons: allLessons = defaultLessons,
  minStartTime,
  minEndTime,
  minorHourLines = 1
}: ScheduleProps) => {
  const [hoveredCourseCode, setHoveredCourseCode] = useState<string | null>(null);
  const { i18n } = useTranslation();

  const { colorScheme } = useMantineColorScheme();

  const dayCount = 5;
  const weekStart = dayjs()
    .startOf("week")
    .add(1, "day"); // dayjs starts week on Sunday, but we need Monday

  const lessons = allLessons.filter(lesson => {
    const startTime = dayjs(lesson.startTime);
    const endTime = dayjs(lesson.endTime);
    // TODO: Allow events to span multiple days/weeks
    return startTime.isSame(weekStart, "week") && startTime.isSame(endTime, "day");
  });

  const sortedStartTime = [...lessons].sort((a, b) => {
    const firstStart = dayjs(a.startTime).unix() - dayjs(a.startTime).startOf("day").unix();
    const secondStart = dayjs(b.startTime).unix() - dayjs(b.startTime).startOf("day").unix();
    return firstStart - secondStart;
  });

  const firstLessonStart = sortedStartTime.length > 0 ? sortedStartTime[0].startTime : undefined;
  const earliestStartTimeUnix = firstLessonStart === undefined ? minStartTime : Math.min(unixSinceMidnight(firstLessonStart), minStartTime);

  const sortedEndTime = [...lessons].sort((a, b) => {
    const firstEnd = dayjs(a.endTime).unix() - dayjs(a.endTime).startOf("day").unix();
    const secondEnd = dayjs(b.endTime).unix() - dayjs(b.endTime).startOf("day").unix();
    return firstEnd - secondEnd;
  });

  const lastLessonEnd = sortedEndTime.length > 0 ? sortedEndTime[sortedEndTime.length - 1].endTime : undefined;
  const latestEndTimeUnix = lastLessonEnd === undefined ? minEndTime : Math.max(unixSinceMidnight(lastLessonEnd), minEndTime);

  const startHour = Math.floor(earliestStartTimeUnix / 3600);
  const endHour = Math.ceil(latestEndTimeUnix / 3600);

  const hourLineCount = (minorHourLines + 1) * (endHour - startHour) - minorHourLines;

  return <Stack
    mb={12.4} // Needed to ensure the last hour text doesn't overflow outside the component
  >
    <Group ml={TIME_WIDTH}>
      {Array
        .from({ length: dayCount }, (_, i) => weekStart.add(i, "day"))
        .map(columnDay => <Title
          key={columnDay.unix()}
          order={2}
          sx={{ flex: 1 }}
          align="center"
        >
          <Stack spacing={0}>
            <Text size={34} sx={{ lineHeight: 1 }}>
              {columnDay.format("D")}
            </Text>
            <Text size="sm">
              {columnDay.toDate().toLocaleDateString(i18n.language, { weekday: "long" })}
            </Text>
          </Stack>
        </Title>)}
    </Group>
    <Group sx={{ flex: 1, position: "relative", marginLeft: TIME_WIDTH }} spacing={0}>
      {Array
        .from({ length: hourLineCount }, (_, i) => i + startHour)
        .map((hour, i) => (i % (minorHourLines + 1) === 0)
          ? <HourLine
            key={hour}
            isMajor={true}
            lineCount={hourLineCount}
            lineIndex={i}
            text={(startHour + (i / (minorHourLines + 1))).toString() + ":00 "} />
          : <HourLine
            key={hour}
            isMajor={false}
            lineIndex={i}
            lineCount={hourLineCount} />)}
      {Array
        .from({ length: dayCount - 1 }, () => 0)
        .map((_, i) => <div
          key={i}
          style={{
            position: "absolute",
            height: "100%",
            width: 2,
            backgroundColor: colorScheme === "light" ? "#CCC" : "#888",
            left: `${100 * (i + 1) / (dayCount)}%`,
            zIndex: 10
          }}
        />)}
      {Array
        .from({ length: dayCount }, (_, i) => weekStart.add(i, "day"))
        .map(columnDay => <ScheduleDay
          key={columnDay.unix()}
          day={columnDay}
          dayStart={startHour * 3600}
          dayEnd={(endHour - 1) * 3600}
          lessons={lessons.filter(lesson => columnDay.isSame(lesson.startTime, "day"))}
          hoveredCourseCode={hoveredCourseCode}
          setHoveredCourseCode={setHoveredCourseCode}
        />)}
    </Group>
  </Stack>;
};
