// Mirrors backend GRADING_SYSTEM constants exactly.
// Any changes to the grading thresholds must be updated here AND in backend/src/utils/constants.ts

export const GRADING_SYSTEM = {
  PASS_THRESHOLD: 40,
  GRADES: [
    { label: 'A', minPct: 70 },
    { label: 'B', minPct: 60 },
    { label: 'C', minPct: 50 },
    { label: 'D', minPct: 40 },
    { label: 'F', minPct: 0  },
  ],
};

/**
 * Returns the letter grade for a given percentage score.
 * Matches the backend getGradeFromPercentage utility exactly.
 */
export const getGradeLetter = (percentage: number): string => {
  for (const grade of GRADING_SYSTEM.GRADES) {
    if (percentage >= grade.minPct) {
      return grade.label;
    }
  }
  return 'F';
};

/**
 * Returns Tailwind color classes for a given grade label.
 */
export const getGradeColorClasses = (grade: string): string => {
  if (grade === 'A' || grade === 'B') return 'bg-secondary/10 text-secondary';
  if (grade === 'C') return 'bg-primary/10 text-primary';
  return 'bg-error/10 text-error';
};
