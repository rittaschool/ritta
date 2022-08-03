import { Lesson } from "../components/schedule/SingleScheduleEntry";

interface Entry {
  id: number,
  start: number,
  end: number
}

const isOverlap = (start: number, end: number, value: number) => value > start && value < end

export const calculateOverlaps = (entries: Entry[]) => {
  return entries.reduce<(Entry & { overlaps: number[] })[]>((acc, entry) => {
    const overlaps = entries
      .filter(o => o.id !== entry.id)
      .reduce<number[]>((acc, o) => {
        if (isOverlap(entry.start, entry.end, o.start) || isOverlap(entry.start, entry.end, o.end)) {
          return [...acc, o.id]
        }
        return acc;
      }, []);

    return [...acc, { ...entry, overlaps }]
  }, []);
};

export const getColumns = (lessons: Lesson[]) => {
  const overlaps = calculateOverlaps(lessons.map(l => ({
    id: l.id,
    start: l.startTime.getTime(),
    end: l.endTime.getTime()
  })))
    .map(l => ({
      overlaps: l.overlaps,
      ...lessons.find(l2 => l2.id === l.id)!
    }));

  overlaps.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

  let result: (Lesson & { column: number })[] = [];

  result.push({
    ...overlaps.shift()!,
    column: 0
  });

  while (result.length < lessons.length) {
    const nextToInsert = overlaps.shift()!;

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

