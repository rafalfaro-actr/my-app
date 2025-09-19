import { uuid, text, pgTable } from "drizzle-orm/pg-core";
import { users } from "./user";
import { roles } from "./role";
import { relations } from "drizzle-orm";

export const memberships = pgTable('memberships', {
  id: uuid('id').primaryKey(), // MUST BE A VALID UUI OR IT FAILS TO INSERT, USE A VALID GENERATOR ALGORITHM
  userId:  uuid('userId').references(() => users.id), // MUST BE A VALID UUI OR IT FAILS TO INSERT, USE A VALID GENERATOR ALGORITHM
  roleId: uuid('roleId').references(() => roles.id) // MUST BE A VALID UUI OR IT FAILS TO INSERT, USE A VALID GENERATOR ALGORITHM
});

export const membershipsRelations = relations(memberships, ({ one, many }) => ({
	userId: one(users, {
		fields: [memberships.userId],
		references: [users.id],
	}),
    roleId: one(roles, {
		fields: [memberships.roleId],
		references: [roles.id],
	}),
}));