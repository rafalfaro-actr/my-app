import { uuid, text, pgTable } from "drizzle-orm/pg-core";

export const roles = pgTable('roles', {
  id: uuid('id').primaryKey(), // MUST BE A VALID UUI OR IT FAILS TO INSERT, USE A VALID GENERATOR ALGORITHM
  name: text('name').notNull() // We must be able to change the role name without losing the relationships
});