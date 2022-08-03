import { Group, Stack, Title } from "@mantine/core";
import dayjs from "dayjs";
import { unixSinceMidnight } from "../../utils/timeUtils";
import SingleScheduleEntry, { Lesson } from "./SingleScheduleEntry";

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
    courseName: "Maths",
    startTime: new Date(2022, 7, 3, 9, 30, 0),
    endTime: new Date(2022, 7, 3, 10, 30, 0),
  }, {
    id: 2,
    courseName: "Physics",
    startTime: new Date(2022, 7, 4, 8, 30, 0),
    endTime: new Date(2022, 7, 4, 9, 45, 0),
  }, {
    id: 3,
    courseName: "Chemistry",
    startTime: new Date(2022, 7, 4, 10, 30, 0),
    endTime: new Date(2022, 7, 4, 11, 45, 0),
  }]
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

      return <Stack sx={{ flex: 1 }} key={i}>
        <Title order={2}>{weekStart.add(i, "day").format("D.M.YYYY")}</Title>
        <div style={{ height: 550, backgroundColor: "#24262D", position: "relative" }}>
          {dayLessons.map(lesson => <SingleScheduleEntry
            key={lesson.id}
            dayStart={earliestStartTime}
            dayEnd={latestEndTime}
            lesson={lesson}
          />)}
        </div>
      </Stack>;
    })}
  </Group>
};
