import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid
} from "drizzle-orm/pg-core";

export const questionTypeEnum = pgEnum("question_type", [
  "boolean",
  "number",
  "string"
]);

export const plans = pgTable("plans", {
  id: uuid("id").primaryKey(),
  handle: text("handle").notNull().unique(),
  title: text("title").notNull(),
  adminPasswordHash: text("admin_password_hash").notNull(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull()
});

export const planQuestions = pgTable("plan_questions", {
  id: uuid("id").primaryKey(),
  planId: uuid("plan_id")
    .notNull()
    .references(() => plans.id),
  label: text("label").notNull(),
  type: questionTypeEnum("type").notNull(),
  sortOrder: integer("sort_order").notNull()
});

export const participants = pgTable("participants", {
  id: uuid("id").primaryKey(),
  planId: uuid("plan_id")
    .notNull()
    .references(() => plans.id),
  nickname: text("nickname").notNull(),
  desiredNights: integer("desired_nights").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull()
});

export const availabilityRanges = pgTable("availability_ranges", {
  id: uuid("id").primaryKey(),
  participantId: uuid("participant_id")
    .notNull()
    .references(() => participants.id),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull()
});

export const participantAnswers = pgTable("participant_answers", {
  id: uuid("id").primaryKey(),
  participantId: uuid("participant_id")
    .notNull()
    .references(() => participants.id),
  questionId: uuid("question_id")
    .notNull()
    .references(() => planQuestions.id),
  booleanValue: boolean("boolean_value"),
  numberValue: integer("number_value"),
  stringValue: text("string_value"),
  rawValue: jsonb("raw_value").notNull()
});

