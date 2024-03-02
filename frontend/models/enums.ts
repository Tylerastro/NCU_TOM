// enums.ts

// Define types for the priority and status numbers
type PriorityNumber = 1 | 2 | 3 | 4;
export type StatusNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7;
type ObservatoryNumber = 1;

const PRIORITIES: { [key in PriorityNumber]: string } = {
  1: "HIGH",
  2: "MEDIUM",
  3: "LOW",
  4: "TOO",
};

const STATUSES: { [key in StatusNumber]: string } = {
  1: "Prep.",
  2: "Pending",
  3: "In progress",
  4: "DONE",
  5: "EXPIRED",
  6: "DENIED",
  7: "Postponed",
};

const OBSERVATORIES: { [key in ObservatoryNumber]: string } = {
  1: "Lulin",
};
function getPriorityLabel(priorityNumber: PriorityNumber): string {
  return PRIORITIES[priorityNumber];
}

function getStatusLabel(statusNumber: StatusNumber): string {
  return STATUSES[statusNumber];
}

function getObservatoryLabel(observatoryNumber: ObservatoryNumber): string {
  return OBSERVATORIES[observatoryNumber];
}

export { getPriorityLabel, getStatusLabel, getObservatoryLabel };
