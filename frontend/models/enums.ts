// enums.ts
const PRIORITIES: { [key: number]: string } = {
  1: "HIGH",
  2: "MEDIUM",
  3: "LOW",
  4: "TOO",
};

const STATUSES: { [key: number]: string } = {
  1: "Prep.",
  2: "Pending",
  3: "In progress",
  4: "DONE",
  5: "EXPIRED",
  6: "DENIED",
  7: "Postponed",
};

const OBSERVATORIES: { [key: number]: string } = {
  1: "Lulin",
};
function getPriorityLabel(priorityNumber: number): string {
  return PRIORITIES[priorityNumber];
}

function getStatusLabel(statusNumber: number): string {
  return STATUSES[statusNumber];
}

function getObservatoryLabel(observatoryNumber: number): string {
  return OBSERVATORIES[observatoryNumber] || "Unknown Observatory";
}

export { getPriorityLabel, getStatusLabel, getObservatoryLabel };
