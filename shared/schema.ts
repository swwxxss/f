import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Subscription plans
export const subscriptionPlans = pgTable("subscription_plans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  price: integer("price").notNull(),
  interval: text("interval").notNull().default("month"),
  features: text("features").array().notNull(),
  isPopular: boolean("is_popular").default(false),
  isBest: boolean("is_best").default(false),
});

export const insertSubscriptionPlanSchema = createInsertSchema(subscriptionPlans).omit({
  id: true,
});

export type InsertSubscriptionPlan = z.infer<typeof insertSubscriptionPlanSchema>;
export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;

// User subscriptions
export const userSubscriptions = pgTable("user_subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  planId: integer("plan_id").notNull(),
  startDate: timestamp("start_date").notNull().defaultNow(),
  endDate: timestamp("end_date").notNull(),
  isActive: boolean("is_active").default(true),
});

export const insertUserSubscriptionSchema = createInsertSchema(userSubscriptions).omit({
  id: true,
});

export type InsertUserSubscription = z.infer<typeof insertUserSubscriptionSchema>;
export type UserSubscription = typeof userSubscriptions.$inferSelect;

// Tattoo salons
export const tattooSalons = pgTable("tattoo_salons", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  rating: text("rating").notNull(),
  image: text("image").notNull(), // URL to the salon image
  description: text("description").notNull(),
  styles: text("styles").array().notNull(),
});

export const insertTattooSalonSchema = createInsertSchema(tattooSalons).omit({
  id: true,
});

export type InsertTattooSalon = z.infer<typeof insertTattooSalonSchema>;
export type TattooSalon = typeof tattooSalons.$inferSelect;

// Messages
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  salonId: integer("salon_id").notNull(),
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  isFromUser: boolean("is_from_user").notNull(),
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
});

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

// Conversation (to track active conversations)
export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  salonId: integer("salon_id").notNull(),
  lastMessageAt: timestamp("last_message_at").notNull().defaultNow(),
  unreadCount: integer("unread_count").notNull().default(0),
});

export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
});

export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Conversation = typeof conversations.$inferSelect;
