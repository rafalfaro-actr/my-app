import { uuid, text, pgTable } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { memberships } from "./membership";

export const users = pgTable('users', {
  id: uuid('id').primaryKey(), // MUST BE A VALID UUI OR IT FAILS TO INSERT, USE A VALID GENERATOR ALGORITHM
  name: text('name').notNull()
});

export const usersRelations = relations(users, ({ many }) => ({
	memberships: many(memberships),
}));