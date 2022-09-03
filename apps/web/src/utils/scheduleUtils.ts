import { Lesson } from "../components/schedule/SingleScheduleEntry";

export const getColumns = (lessons: Lesson[]) => {
  const sortedLessons = [...lessons].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

  return sortedLessons.reduce<(Lesson & { column: number })[]>((insertedLessons, lesson) => {
    const maxColumn = insertedLessons.length === 0 ? 0 : Math.max(...insertedLessons.map(l => l.column));
    const columnCount = maxColumn + 1;

    for (let currentCheckColumn = 0; currentCheckColumn < columnCount + 1; currentCheckColumn++) {
      const canFitInColumn = insertedLessons
        .filter(l => l.column === currentCheckColumn)
        .every(l => l.endTime.getTime() < lesson.startTime.getTime());

      if (canFitInColumn) {
        return insertedLessons.concat({ ...lesson, column: currentCheckColumn });
      }
    }

    // This should never happen
    console.error("Could not find a column for lesson", lesson);
    return insertedLessons;
  }, []);
};

