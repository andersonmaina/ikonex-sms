export const GRADING_SYSTEM = {
  // The minimum percentage required to pass an assessment
  PASS_THRESHOLD: 50,

  // Letter grades and their minimum percentage thresholds
  // Note: These must remain sorted from highest to lowest!
  GRADES: [
    { label: 'A', minPct: 80, gpaValue: 4.0 },
    { label: 'B', minPct: 70, gpaValue: 3.0 },
    { label: 'C', minPct: 60, gpaValue: 2.0 },
    { label: 'D', minPct: 50, gpaValue: 1.0 },
    { label: 'F', minPct: 0,  gpaValue: 0.0 }
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
