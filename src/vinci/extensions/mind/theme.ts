export const BRANCH_COLORS = [
  "#A287E0",
  "#6E80DB",
  "#6DC4C4",
  "#E0B75E",
  "#B1C675",
  "#77C386",
  "#C18976",
  "#E48484",
  "#E582D4",
  "#6AB1E4",
];

export const getBranchColor = (nodeIndex: number) => {
  return BRANCH_COLORS[nodeIndex % (BRANCH_COLORS.length - 1)];
};
