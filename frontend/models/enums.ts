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

enum LulinInstrument {
  LOT = 1,
  SLT,
  TRIPOL,
}

enum LulinFilter {
  u = 1,
  g,
  r,
  i,
  z,
}
enum UserRole {
  Admin = 1,
  Faculty,
  User,
}

export {
  Priority,
  Status,
  Observatory,
  UserRole,
  LulinInstrument,
  LulinFilter,
};
