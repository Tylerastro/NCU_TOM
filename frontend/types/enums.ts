/**
 * Application-wide enums
 */

export enum Priority {
  HIGH = 1,
  MEDIUM = 2,
  LOW = 3,
  TOO = 4,
}

export enum Status {
  Prep = 1,
  Pending = 2,
  In_progress = 3,
  Done = 4,
  Expired = 5,
  Denied = 6,
  Postponed = 7,
}

export enum Observatory {
  Lulin = 1,
}

export enum LulinInstrument {
  LOT = 1,
  SLT = 2,
  TRIPOL = 3,
}

export enum LulinFilter {
  u = 1,
  g = 2,
  r = 3,
  i = 4,
  z = 5,
}

export enum UserRole {
  Admin = 1,
  Faculty = 2,
  User = 3,
  Disabled = 4,
}
