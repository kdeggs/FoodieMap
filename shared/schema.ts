import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, jsonb, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const restaurants = pgTable("restaurants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
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
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const restaurantLists = pgTable("restaurant_lists", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
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
  restaurantId: varchar("restaurant_id").notNull().references(() => restaurants.id, { onDelete: "cascade" }),
  rating: integer("rating"), // 1-5 stars for this visit
  notes: text("notes"),
  visitDate: timestamp("visit_date").default(sql`now()`),
});

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
