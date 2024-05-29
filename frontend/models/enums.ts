enum Priority {
  HIGH = 1,
  MEDIUM,
  LOW,
  TOO,
}

enum Status {
  Prep = 1,
  Pending,
  In_progress,
  Done,
  Expired,
  Denied,
  Postponed,
}

enum Observatory {
  Lulin = 1,
}

enum UserRole {
  Admin = 1,
  Faculty,
  User,
  Visitor,
}

export { Priority, Status, Observatory, UserRole };
