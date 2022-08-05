import { Box, Group, Stack, Text, Title } from "@mantine/core";
import dayjs from "dayjs";
import { useState } from "react";
import { unixSinceMidnight } from "../../utils/timeUtils";
import ScheduleDay from "./ScheduleDay";
import { Lesson } from "./SingleScheduleEntry";

interface ScheduleProps {
  lessons?: Lesson[],
  minStartTime?: number, // seconds since midnight
  minEndTime?: number, // seconds since midnight
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

export default ({ lessons: allLessons = defaultLessons, minStartTime, minEndTime }: ScheduleProps) => {
  const [hoveredCourseCode, setHoveredCourseCode] = useState<string | null>(null);

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

  const lessonsEarliestStartTime = unixSinceMidnight([...lessons].sort((a, b) => {
    const firstStart = dayjs(a.startTime).unix() - dayjs(a.startTime).startOf("day").unix();
    const secondStart = dayjs(b.startTime).unix() - dayjs(b.startTime).startOf("day").unix();
    return firstStart - secondStart;
  })[0].startTime);
  const earliestStartTimeUnix = minStartTime === undefined ? lessonsEarliestStartTime : Math.min(lessonsEarliestStartTime, minStartTime);

  const lessonsLatestEndTime = unixSinceMidnight([...lessons].sort((a, b) => {
    const firstEnd = dayjs(a.endTime).unix() - dayjs(a.endTime).startOf("day").unix();
    const secondEnd = dayjs(b.endTime).unix() - dayjs(b.endTime).startOf("day").unix();
    return firstEnd - secondEnd;
  })[lessons.length - 1].endTime);
  const latestEndTime = minEndTime === undefined ? lessonsLatestEndTime : Math.max(lessonsLatestEndTime, minEndTime);

  const startHour = Math.floor(earliestStartTimeUnix / 3600);
  const endHour = Math.ceil(latestEndTime / 3600);

  const timeWidth = 50;

  const hourLineCount = endHour - startHour;

  return <Stack>
    <Group ml={timeWidth}>
      {Array
        .from({ length: dayCount }, (_, i) => weekStart.add(i, "day"))
        .map(columnDay => <Title key={columnDay.unix()} sx={{ flex: 1 }} align="center">{columnDay.format("D.M.YYYY")}</Title>)}
    </Group>
    <Group sx={{ flex: 1, position: "relative", marginLeft: timeWidth }}>
      {Array
        .from({ length: hourLineCount }, (_, i) => i + startHour)
        .map((hour, i) => {
          const percentageFromTop = 100 * i / (hourLineCount - 1);
          return <div
            key={hour}
            style={{
              position: "absolute",
              width: "100%",
              top: `${percentageFromTop}%`,
              margin: 0,
              zIndex: 3
            }}
          >
            <Text sx={{
              position: "absolute",
              transform: "translateX(calc(-100% - 10px))",
              top: -10
            }}>{hour}:00</Text>
            <hr style={{ margin: 0 }} />
          </div>;
        })}
      {Array
        .from({ length: dayCount }, (_, i) => weekStart.add(i, "day"))
        .map(columnDay =>
          <ScheduleDay
            key={columnDay.unix()}
            day={columnDay}
            dayStart={earliestStartTimeUnix}
            dayEnd={latestEndTime}
            lessons={lessons.filter(lesson => columnDay.isSame(lesson.startTime, "day"))}
            hoveredCourseCode={hoveredCourseCode}
            setHoveredCourseCode={setHoveredCourseCode}
          />)}
    </Group>
  </Stack>;
};
