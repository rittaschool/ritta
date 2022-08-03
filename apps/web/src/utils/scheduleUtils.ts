import { Lesson } from "../components/schedule/SingleScheduleEntry";

export const getColumns = (lessons: Lesson[]) => {
  const sortedLessons = [...lessons].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

  let result: (Lesson & { column: number })[] = [];

  result.push({
    ...sortedLessons.shift()!,
    column: 0
  });

  while (result.length < lessons.length) {
    const nextToInsert = sortedLessons.shift()!;

    let currentCheckColumn = 0;
    while (true) {
      const canFitInColumn = result.filter(r => r.column === currentCheckColumn).every(r => r.endTime.getTime() < nextToInsert.startTime.getTime());
      if (canFitInColumn) {
        result.push({
          ...nextToInsert,
          column: currentCheckColumn
        })
        break;
      }
      else {
        currentCheckColumn++;
      }
    }
  }

  return result;
};

