export const GRADING_SYSTEM = {
  // The minimum percentage required to pass an assessment
  PASS_THRESHOLD: 40,

  // Letter grades and their minimum percentage thresholds
  // Note: These must remain sorted from highest to lowest!
  GRADES: [
    { label: 'A', minPct: 70 },
    { label: 'B', minPct: 60 },
    { label: 'C', minPct: 50 },
    { label: 'D', minPct: 40 },
    { label: 'F', minPct: 0  }
  ]
};

/**
 * Utility function to determine the grade object based on a percentage.
 */
export const getGradeFromPercentage = (percentage: number) => {
  for (const grade of GRADING_SYSTEM.GRADES) {
    if (percentage >= grade.minPct) {
      return grade;
    }
  }
  // Fallback to the lowest grade
  return GRADING_SYSTEM.GRADES[GRADING_SYSTEM.GRADES.length - 1];
};
