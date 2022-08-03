import { Lesson } from "../components/schedule/SingleScheduleEntry";

export const getColumns = (lessons: Lesson[]) => {
  const sortedLessons = [...lessons].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

  const result = sortedLessons.reduce<(Lesson & { column: number })[]>((acc, lesson) => {
    let currentCheckColumn = 0;

    while (true) {
      const canFitInColumn = acc
        .filter(r => r.column === currentCheckColumn)
        .every(r => r.endTime.getTime() < lesson.startTime.getTime());

      if (canFitInColumn) {
        return [
          ...acc,
          { ...lesson, column: currentCheckColumn }
        ];
      }

      currentCheckColumn++;
    }
  }, []);

  return result;
};

