import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // prefix all routes with /api
  const apiRouter = app.route('/api');
  
  // Subscription plans
  app.get('/api/subscription-plans', async (req, res) => {
    try {
      const plans = await storage.getSubscriptionPlans();
      res.json(plans);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch subscription plans' });
    }
  });
  
  // User subscriptions
  app.get('/api/user-subscriptions/:userId', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }
      
      const subscriptions = await storage.getUserSubscriptions(userId);
      
      // Get plan details for each subscription
      const subscriptionsWithPlans = await Promise.all(
        subscriptions.map(async (sub) => {
          const plan = await storage.getSubscriptionPlan(sub.planId);
          return {
            ...sub,
            plan
          };
        })
      );
      
      res.json(subscriptionsWithPlans);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch user subscriptions' });
    }
  });
  
  // Subscribe to a plan
  app.post('/api/subscribe', async (req, res) => {
    try {
      const subscriptionSchema = z.object({
        userId: z.number(),
        planId: z.number()
      });
      
      const parsedBody = subscriptionSchema.safeParse(req.body);
      if (!parsedBody.success) {
        return res.status(400).json({ error: 'Invalid subscription data' });
      }
      
      const { userId, planId } = parsedBody.data;
      
      // Check if user and plan exist
      const user = await storage.getUser(userId);
      const plan = await storage.getSubscriptionPlan(planId);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      if (!plan) {
        return res.status(404).json({ error: 'Subscription plan not found' });
      }
      
      // Create a subscription that lasts for 1 month
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);
      
      const subscription = await storage.createUserSubscription({
        userId,
        planId,
        startDate,
        endDate,
        isActive: true
      });
      
      res.status(201).json({ subscription, plan });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create subscription' });
    }
  });
  
  // Tattoo salons
  app.get('/api/salons', async (req, res) => {
    try {
      const { city, style, search } = req.query;
      
      const filters = {
        ...(city && { city: city as string }),
        ...(style && { style: style as string }),
        ...(search && { search: search as string })
      };
      
      const salons = await storage.getTattooSalons(
        Object.keys(filters).length > 0 ? filters : undefined
      );
      
      res.json(salons);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch salons' });
    }
  });
  
  // Get a specific salon
  app.get('/api/salons/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid salon ID' });
      }
      
      const salon = await storage.getTattooSalon(id);
      if (!salon) {
        return res.status(404).json({ error: 'Salon not found' });
      }
      
      res.json(salon);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch salon' });
    }
  });
  
  // Conversations
  app.get('/api/conversations/:userId', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }
      
      const conversations = await storage.getConversations(userId);
      res.json(conversations);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch conversations' });
    }
  });
  
  // Get messages for a specific conversation
  app.get('/api/messages/:userId/:salonId', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const salonId = parseInt(req.params.salonId);
      
      if (isNaN(userId) || isNaN(salonId)) {
        return res.status(400).json({ error: 'Invalid IDs' });
      }
      
      const messages = await storage.getMessages(userId, salonId);
      
      // Reset unread count when user views messages
      const conversation = await storage.getConversation(userId, salonId);
      if (conversation) {
        await storage.updateConversation(conversation.id, { unreadCount: 0 });
      }
      
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch messages' });
    }
  });
  
  // Send a message
  app.post('/api/messages', async (req, res) => {
    try {
      const messageSchema = z.object({
        userId: z.number(),
        salonId: z.number(),
        content: z.string().min(1),
        isFromUser: z.boolean()
      });
      
      const parsedBody = messageSchema.safeParse(req.body);
      if (!parsedBody.success) {
        return res.status(400).json({ error: 'Invalid message data' });
      }
      
      const { userId, salonId, content, isFromUser } = parsedBody.data;
      
      // Check if user and salon exist
      const user = await storage.getUser(userId);
      const salon = await storage.getTattooSalon(salonId);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      if (!salon) {
        return res.status(404).json({ error: 'Salon not found' });
      }
      
      const message = await storage.createMessage({
        userId,
        salonId,
        content,
        timestamp: new Date(),
        isFromUser
      });
      
      res.status(201).json(message);
    } catch (error) {
      res.status(500).json({ error: 'Failed to send message' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
