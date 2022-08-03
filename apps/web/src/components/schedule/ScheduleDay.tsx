import { Stack, Title } from "@mantine/core";
import { Dayjs } from "dayjs";
import SingleScheduleEntry, { Lesson } from "./SingleScheduleEntry";

export interface ScheduleDayProps {
  day: Dayjs,
  dayStart: number,
  dayEnd: number,
  lessons: Lesson[],
}

export default ({
  day,
  dayStart,
  dayEnd,
  lessons
}: ScheduleDayProps) => {
  return <Stack sx={{ flex: 1 }}>
    <Title order={2}>{day.format("D.M.YYYY")}</Title>
    <div style={{ height: 550, backgroundColor: "#24262D", position: "relative" }}>
      {lessons.map(lesson => <SingleScheduleEntry
        key={lesson.id}
        dayStart={dayStart}
        dayEnd={dayEnd}
        lesson={lesson}
      />)}
    </div>
  </Stack>;
}
