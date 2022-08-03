import { Box, Group, Stack, Text, Title } from "@mantine/core";
import dayjs from "dayjs";
import React from "react";
import { inverseLerp } from "../utils/numberUtils";
import { unixSinceMidnight } from "../utils/timeUtils";

interface Lesson {
  id: number;
  courseName: string;
  startTime: Date;
  endTime: Date;
}

interface ScheduleProps {
  lessons?: Lesson[],
  minStartTime?: number, // seconds since midnight
  minEndTime?: number, // seconds since midnight
}

// TODO: Remove these default props, they are only for development
const defaultProps = {
  lessons: [{
    id: 0,
    courseName: "Maths",
    startTime: new Date(2022, 7, 3, 9, 0, 0),
    endTime: new Date(2022, 7, 3, 10, 0, 0),
  }, {
    id: 1,
    courseName: "Physics",
    startTime: new Date(2022, 7, 4, 8, 30, 0),
    endTime: new Date(2022, 7, 4, 9, 45, 0),
  }, {
    id: 2,
    courseName: "Chemistry",
    startTime: new Date(2022, 7, 4, 10, 30, 0),
    endTime: new Date(2022, 7, 4, 11, 45, 0),
  }]
}

const ScheduleEntry = ({ dayStart, dayEnd, lesson }: {
  dayStart: number, // seconds since midnight
  dayEnd: number, // seconds since midnight
  lesson: Lesson
}) => {
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

export default ({ lessons: allLessons = defaultProps.lessons, minStartTime, minEndTime }: ScheduleProps) => {
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
  const earliestStartTime = minStartTime === undefined ? lessonsEarliestStartTime : Math.min(lessonsEarliestStartTime, minStartTime);

  const lessonsLatestEndTime = unixSinceMidnight([...lessons].sort((a, b) => {
    const firstEnd = dayjs(a.endTime).unix() - dayjs(a.endTime).startOf("day").unix();
    const secondEnd = dayjs(b.endTime).unix() - dayjs(b.endTime).startOf("day").unix();
    return firstEnd - secondEnd;
  })[lessons.length - 1].endTime);
  const latestEndTime = minEndTime === undefined ? lessonsLatestEndTime : Math.max(lessonsLatestEndTime, minEndTime);

  return <Group>
    {Array.from({ length: dayCount }).map((_, i) => {
      const day = weekStart.add(i, "day");

      const dayLessons = lessons.filter(l => dayjs(l.startTime).isSame(day, "day"));

      return <React.Fragment key={i}>
        <Stack sx={{ flex: 1 }}>
          <Title order={2}>{weekStart.add(i, "day").format("D.M.YYYY")}</Title>
          <div style={{ height: 550, backgroundColor: "#24262D", position: "relative" }}>
            {dayLessons.map(lesson => <ScheduleEntry
              key={lesson.id}
              dayStart={earliestStartTime}
              dayEnd={latestEndTime}
              lesson={lesson}
            />)}
          </div>
        </Stack>
      </React.Fragment>;
    })}
  </Group>
};
