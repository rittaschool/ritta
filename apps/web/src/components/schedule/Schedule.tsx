import { Group, Stack, useMantineColorScheme } from "@mantine/core";
import dayjs from "dayjs";
import { useState } from "react";
import { unixSinceMidnight } from "../../utils/timeUtils";
import HourLine from "./HourLine";
import ScheduleDay from "./ScheduleDay";
import ScheduleWeekdayTitle from "./ScheduleWeekdayTitle";
import { Lesson } from "./SingleScheduleEntry";

const TIME_WIDTH = 50;

interface ScheduleProps {
  lessons?: Lesson[],
  minStartTime: number, // seconds since midnight
  minEndTime: number, // seconds since midnight
  minorHourLines?: number // how many minor hour lines are between each major hour line
}

const startOfWeek = dayjs().startOf("week").add(1, "day");

const getTime = (dayOffset: number, hour: number, minute: number) => startOfWeek.add(dayOffset, "day").add(hour, "hour").add(minute, "minute").toDate();

// TODO: Remove these default props, they are only for development
const defaultLessons: Lesson[] = [
  {
    id: 0,
    courseCode: "MAT-2",
    courseName: "Maths",
    startTime: getTime(0, 9, 30),
    endTime: getTime(0, 10, 30),
    room: "A2",
    teacher: "Minna Muuttuja"
  },
  {
    id: 1,
    courseCode: "MAT-1",
    courseName: "Maths",
    startTime: getTime(1, 9, 0),
    endTime: getTime(1, 10, 0),
    room: "A1",
    teacher: "Matti Matemaatikko"
  },
  {
    id: 2,
    courseCode: "MAT-2",
    courseName: "Maths",
    startTime: startOfWeek.add(2, "day").set("hour", 13).set("minute", 30).toDate(),
    endTime: startOfWeek.add(2, "day").set("hour", 14).set("minute", 30).toDate(),
    room: "A2",
    teacher: "Minna Muuttuja"
  },
  {
    id: 3,
    courseCode: "PHY-1",
    courseName: "Physics",
    startTime: getTime(3, 8, 30),
    endTime: getTime(3, 9, 45),
    room: "A3",
    teacher: "Frans Fyysikko"
  },
  {
    id: 4,
    courseCode: "CHE-1",
    courseName: "Chemistry",
    startTime: getTime(3, 9, 30),
    endTime: getTime(3, 10, 45),
    room: "A4",
    teacher: "Kaisa Kemisti"
  },
  {
    id: 5,
    courseCode: "CHE-1",
    courseName: "Chemistry",
    startTime: getTime(1, 11, 30),
    endTime: getTime(1, 12, 45),
    room: "A4",
    teacher: "Kaisa Kemisti"
  },
  {
    id: 6,
    courseCode: "PHY-1",
    courseName: "Physics",
    startTime: getTime(4, 11, 30),
    endTime: getTime(4, 12, 45),
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
    <Group ml={TIME_WIDTH} spacing={0}>
      {Array
        .from({ length: dayCount }, (_, i) => weekStart.add(i, "day"))
        .map(columnDay => <ScheduleWeekdayTitle key={columnDay.unix()} day={columnDay} />)}
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
