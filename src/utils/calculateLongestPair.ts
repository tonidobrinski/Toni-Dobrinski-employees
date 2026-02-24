import type { EmployeeRecord, ProjectOverlap } from "../types";

//  Normalize date to UTC midnight to avoid timezone issues
const normalizeToUTC = (date: Date): number => {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
};

//  Calculate inclusive days between two dates

const calculateDays = (start: Date, end: Date): number => {
  const startUTC = normalizeToUTC(start);
  const endUTC = normalizeToUTC(end);

  const diff = endUTC - startUTC;

  if (diff < 0) return 0;

  return Math.floor(diff / (1000 * 60 * 60 * 24) + 1);
};

export const calculateLongestPair = (
  records: EmployeeRecord[],
): ProjectOverlap[] => {
  const pairTotals = new Map<string, number>();
  const pairProjects = new Map<string, ProjectOverlap[]>();

  // Group records by project to reduce unnecessary comparisons
  const projectGroups = new Map<number, EmployeeRecord[]>();

  for (const record of records) {
    if (!projectGroups.has(record.projectId)) {
      projectGroups.set(record.projectId, []);
    }
    projectGroups.get(record.projectId)!.push(record);
  }

  // Process each project separately
  for (const [projectId, employees] of projectGroups.entries()) {
    for (let i = 0; i < employees.length; i++) {
      for (let j = i + 1; j < employees.length; j++) {
        const r1 = employees[i];
        const r2 = employees[j];

        if (r1.empId === r2.empId) continue;

        const overlapStart = new Date(
          Math.max(r1.dateFrom.getTime(), r2.dateFrom.getTime()),
        );

        const overlapEnd = new Date(
          Math.min(r1.dateTo.getTime(), r2.dateTo.getTime()),
        );

        if (overlapStart <= overlapEnd) {
          const daysWorked = calculateDays(overlapStart, overlapEnd);

          if (daysWorked <= 0) continue;

          const emp1 = Math.min(r1.empId, r2.empId);
          const emp2 = Math.max(r1.empId, r2.empId);

          const key = `${emp1}-${emp2}`;

          const overlap: ProjectOverlap = {
            emp1,
            emp2,
            projectId,
            daysWorked,
          };

          // accumulate total days for the pair
          pairTotals.set(key, (pairTotals.get(key) || 0) + daysWorked);

          if (!pairProjects.has(key)) {
            pairProjects.set(key, []);
          }

          pairProjects.get(key)!.push(overlap);
        }
      }
    }
  }

  // Find pair with maximum total days
  let maxPairKey = "";
  let maxDays = 0;

  pairTotals.forEach((total, key) => {
    if (total > maxDays) {
      maxDays = total;
      maxPairKey = key;
    }
  });

  return pairProjects.get(maxPairKey) || [];
};
