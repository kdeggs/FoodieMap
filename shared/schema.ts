import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, jsonb, timestamp, boolean, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const restaurants = pgTable("restaurants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  cuisine: text("cuisine").notNull(),
  priceRange: text("price_range").notNull(), // $, $$, $$$, $$$$
  address: text("address"),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  rating: integer("rating").default(0), // 0-5 stars
  notes: text("notes"),
  isVisited: boolean("is_visited").default(false),
  checkInCount: integer("check_in_count").default(0),
  placeId: varchar("place_id"), // For Google Places API reference
  photoUrl: text("photo_url"), // Restaurant photo
  phoneNumber: varchar("phone_number"),
  website: text("website"),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const restaurantLists = pgTable("restaurant_lists", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon").default("utensils"),
  color: text("color").default("primary"),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const listRestaurants = pgTable("list_restaurants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  listId: varchar("list_id").notNull().references(() => restaurantLists.id, { onDelete: "cascade" }),
  restaurantId: varchar("restaurant_id").notNull().references(() => restaurants.id, { onDelete: "cascade" }),
  addedAt: timestamp("added_at").default(sql`now()`),
});

export const checkIns = pgTable("check_ins", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  restaurantId: varchar("restaurant_id").notNull().references(() => restaurants.id, { onDelete: "cascade" }),
  rating: integer("rating"), // 1-5 stars for this visit
  notes: text("notes"),
  visitDate: timestamp("visit_date").default(sql`now()`),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  restaurants: many(restaurants),
  lists: many(restaurantLists),
  checkIns: many(checkIns),
}));

export const restaurantsRelations = relations(restaurants, ({ one, many }) => ({
  user: one(users, {
    fields: [restaurants.userId],
    references: [users.id],
  }),
  listRestaurants: many(listRestaurants),
  checkIns: many(checkIns),
}));

export const restaurantListsRelations = relations(restaurantLists, ({ one, many }) => ({
  user: one(users, {
    fields: [restaurantLists.userId],
    references: [users.id],
  }),
  listRestaurants: many(listRestaurants),
}));

export const listRestaurantsRelations = relations(listRestaurants, ({ one }) => ({
  list: one(restaurantLists, {
    fields: [listRestaurants.listId],
    references: [restaurantLists.id],
  }),
  restaurant: one(restaurants, {
    fields: [listRestaurants.restaurantId],
    references: [restaurants.id],
  }),
}));

export const checkInsRelations = relations(checkIns, ({ one }) => ({
  user: one(users, {
    fields: [checkIns.userId],
    references: [users.id],
  }),
  restaurant: one(restaurants, {
    fields: [checkIns.restaurantId],
    references: [restaurants.id],
  }),
}));

export const insertRestaurantSchema = createInsertSchema(restaurants).omit({
  id: true,
  createdAt: true,
});

export const insertRestaurantListSchema = createInsertSchema(restaurantLists).omit({
  id: true,
  createdAt: true,
});

export const insertListRestaurantSchema = createInsertSchema(listRestaurants).omit({
  id: true,
  addedAt: true,
});

export const insertCheckInSchema = createInsertSchema(checkIns).omit({
  id: true,
  visitDate: true,
});

export type Restaurant = typeof restaurants.$inferSelect;
export type InsertRestaurant = z.infer<typeof insertRestaurantSchema>;
export type RestaurantList = typeof restaurantLists.$inferSelect;
export type InsertRestaurantList = z.infer<typeof insertRestaurantListSchema>;
export type ListRestaurant = typeof listRestaurants.$inferSelect;
export type InsertListRestaurant = z.infer<typeof insertListRestaurantSchema>;
export type CheckIn = typeof checkIns.$inferSelect;
export type InsertCheckIn = z.infer<typeof insertCheckInSchema>;

// User types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
