import { 
  users, User, InsertUser, 
  subscriptionPlans, SubscriptionPlan, InsertSubscriptionPlan,
  userSubscriptions, UserSubscription, InsertUserSubscription,
  tattooSalons, TattooSalon, InsertTattooSalon,
  messages, Message, InsertMessage,
  conversations, Conversation, InsertConversation
} from "@shared/schema";

// Storage interface
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Subscription plan methods
  getSubscriptionPlans(): Promise<SubscriptionPlan[]>;
  getSubscriptionPlan(id: number): Promise<SubscriptionPlan | undefined>;
  createSubscriptionPlan(plan: InsertSubscriptionPlan): Promise<SubscriptionPlan>;
  
  // User subscription methods
  getUserSubscriptions(userId: number): Promise<UserSubscription[]>;
  createUserSubscription(subscription: InsertUserSubscription): Promise<UserSubscription>;
  updateUserSubscription(id: number, isActive: boolean): Promise<UserSubscription | undefined>;
  
  // Tattoo salon methods
  getTattooSalons(filters?: { city?: string, style?: string, search?: string }): Promise<TattooSalon[]>;
  getTattooSalon(id: number): Promise<TattooSalon | undefined>;
  createTattooSalon(salon: InsertTattooSalon): Promise<TattooSalon>;
  
  // Message methods
  getMessages(userId: number, salonId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  
  // Conversation methods
  getConversations(userId: number): Promise<(Conversation & { salon: TattooSalon })[]>;
  getConversation(userId: number, salonId: number): Promise<Conversation | undefined>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  updateConversation(id: number, data: { lastMessageAt?: Date, unreadCount?: number }): Promise<Conversation | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private subscriptionPlans: Map<number, SubscriptionPlan>;
  private userSubscriptions: Map<number, UserSubscription>;
  private tattooSalons: Map<number, TattooSalon>;
  private messages: Map<number, Message>;
  private conversations: Map<number, Conversation>;
  
  private currentUserId: number;
  private currentPlanId: number;
  private currentSubscriptionId: number;
  private currentSalonId: number;
  private currentMessageId: number;
  private currentConversationId: number;

  constructor() {
    this.users = new Map();
    this.subscriptionPlans = new Map();
    this.userSubscriptions = new Map();
    this.tattooSalons = new Map();
    this.messages = new Map();
    this.conversations = new Map();
    
    this.currentUserId = 1;
    this.currentPlanId = 1;
    this.currentSubscriptionId = 1;
    this.currentSalonId = 1;
    this.currentMessageId = 1;
    this.currentConversationId = 1;
    
    // Initialize with some data
    this.seedData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Subscription plan methods
  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    return Array.from(this.subscriptionPlans.values());
  }
  
  async getSubscriptionPlan(id: number): Promise<SubscriptionPlan | undefined> {
    return this.subscriptionPlans.get(id);
  }
  
  async createSubscriptionPlan(plan: InsertSubscriptionPlan): Promise<SubscriptionPlan> {
    const id = this.currentPlanId++;
    const newPlan: SubscriptionPlan = { ...plan, id };
    this.subscriptionPlans.set(id, newPlan);
    return newPlan;
  }
  
  // User subscription methods
  async getUserSubscriptions(userId: number): Promise<UserSubscription[]> {
    return Array.from(this.userSubscriptions.values()).filter(
      (subscription) => subscription.userId === userId
    );
  }
  
  async createUserSubscription(subscription: InsertUserSubscription): Promise<UserSubscription> {
    const id = this.currentSubscriptionId++;
    const newSubscription: UserSubscription = { ...subscription, id };
    this.userSubscriptions.set(id, newSubscription);
    return newSubscription;
  }
  
  async updateUserSubscription(id: number, isActive: boolean): Promise<UserSubscription | undefined> {
    const subscription = this.userSubscriptions.get(id);
    if (!subscription) return undefined;
    
    const updatedSubscription: UserSubscription = { ...subscription, isActive };
    this.userSubscriptions.set(id, updatedSubscription);
    return updatedSubscription;
  }
  
  // Tattoo salon methods
  async getTattooSalons(filters?: { city?: string, style?: string, search?: string }): Promise<TattooSalon[]> {
    let salons = Array.from(this.tattooSalons.values());
    
    if (filters) {
      if (filters.city && filters.city !== "Всі міста") {
        salons = salons.filter(salon => salon.city === filters.city);
      }
      
      if (filters.style && filters.style !== "Всі стилі") {
        salons = salons.filter(salon => salon.styles.includes(filters.style));
      }
      
      if (filters.search) {
        const search = filters.search.toLowerCase();
        salons = salons.filter(
          salon => 
            salon.name.toLowerCase().includes(search) || 
            salon.description.toLowerCase().includes(search) ||
            salon.styles.some(style => style.toLowerCase().includes(search))
        );
      }
    }
    
    return salons;
  }
  
  async getTattooSalon(id: number): Promise<TattooSalon | undefined> {
    return this.tattooSalons.get(id);
  }
  
  async createTattooSalon(salon: InsertTattooSalon): Promise<TattooSalon> {
    const id = this.currentSalonId++;
    const newSalon: TattooSalon = { ...salon, id };
    this.tattooSalons.set(id, newSalon);
    return newSalon;
  }
  
  // Message methods
  async getMessages(userId: number, salonId: number): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(msg => msg.userId === userId && msg.salonId === salonId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }
  
  async createMessage(message: InsertMessage): Promise<Message> {
    const id = this.currentMessageId++;
    const newMessage: Message = { ...message, id };
    this.messages.set(id, newMessage);
    
    // Update conversation's last message timestamp and unread count
    const conversation = await this.getConversation(message.userId, message.salonId);
    if (conversation) {
      const unreadCount = message.isFromUser ? conversation.unreadCount : conversation.unreadCount + 1;
      await this.updateConversation(conversation.id, { 
        lastMessageAt: new Date(),
        unreadCount
      });
    } else {
      // Create a new conversation if it doesn't exist
      await this.createConversation({
        userId: message.userId,
        salonId: message.salonId,
        lastMessageAt: new Date(),
        unreadCount: message.isFromUser ? 0 : 1
      });
    }
    
    return newMessage;
  }
  
  // Conversation methods
  async getConversations(userId: number): Promise<(Conversation & { salon: TattooSalon })[]> {
    const userConversations = Array.from(this.conversations.values()).filter(
      (conv) => conv.userId === userId
    );
    
    return Promise.all(
      userConversations.map(async (conv) => {
        const salon = await this.getTattooSalon(conv.salonId);
        return {
          ...conv,
          salon: salon!
        };
      })
    );
  }
  
  async getConversation(userId: number, salonId: number): Promise<Conversation | undefined> {
    return Array.from(this.conversations.values()).find(
      (conv) => conv.userId === userId && conv.salonId === salonId
    );
  }
  
  async createConversation(conversation: InsertConversation): Promise<Conversation> {
    const id = this.currentConversationId++;
    const newConversation: Conversation = { ...conversation, id };
    this.conversations.set(id, newConversation);
    return newConversation;
  }
  
  async updateConversation(id: number, data: { lastMessageAt?: Date, unreadCount?: number }): Promise<Conversation | undefined> {
    const conversation = this.conversations.get(id);
    if (!conversation) return undefined;
    
    const updatedConversation: Conversation = { 
      ...conversation,
      ...(data.lastMessageAt && { lastMessageAt: data.lastMessageAt }),
      ...(data.unreadCount !== undefined && { unreadCount: data.unreadCount })
    };
    
    this.conversations.set(id, updatedConversation);
    return updatedConversation;
  }
  
  // Seed initial data
  private seedData() {
    // Create a sample user
    this.createUser({ username: "testuser", password: "password" });
    
    // Create subscription plans
    this.createSubscriptionPlan({
      name: "Базовий",
      price: 199,
      interval: "month",
      features: [
        "20 генерацій тату на місяць",
        "Базові стилі та техніки",
        "Експорт у PNG/JPG",
        "Преміум стилі та фільтри"
      ],
      isPopular: true,
      isBest: false
    });
    
    this.createSubscriptionPlan({
      name: "Професійний",
      price: 349,
      interval: "month",
      features: [
        "Необмежені генерації",
        "Всі стилі та техніки",
        "Експорт у всіх форматах",
        "Преміум підтримка"
      ],
      isPopular: false,
      isBest: true
    });
    
    this.createSubscriptionPlan({
      name: "Для салонів",
      price: 899,
      interval: "month",
      features: [
        "Необмежені генерації",
        "Брендування та власні стилі",
        "5 акаунтів для майстрів",
        "Пріоритетна підтримка"
      ],
      isPopular: false,
      isBest: false
    });
    
    // Create a sample user subscription
    const now = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);
    
    this.createUserSubscription({
      userId: 1,
      planId: 2, // Professional plan
      startDate: now,
      endDate: endDate,
      isActive: true
    });
    
    // Add a previous subscription (ended)
    const prevStartDate = new Date();
    prevStartDate.setMonth(prevStartDate.getMonth() - 1);
    const prevEndDate = new Date();
    
    this.createUserSubscription({
      userId: 1,
      planId: 1, // Basic plan
      startDate: prevStartDate,
      endDate: prevEndDate,
      isActive: false
    });
    
    // Create sample tattoo salons
    this.createTattooSalon({
      name: "InkMasters Tattoo Studio",
      address: "вул. Хрещатик, 12",
      city: "Київ",
      rating: "4.8",
      image: "https://images.unsplash.com/photo-1598443861840-4bef05b6ff5d?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      description: "Студія з 15-річним досвідом створення унікальних тату. Працюємо з усіма стилями.",
      styles: ["Традиційний", "Реалізм", "Мінімалізм"]
    });
    
    this.createTattooSalon({
      name: "Black Lotus Tattoo",
      address: "вул. Франка, 22",
      city: "Львів",
      rating: "4.9",
      image: "https://images.unsplash.com/photo-1559671216-2c0df61072a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      description: "Авторська студія з індивідуальним підходом. Спеціалізуємося на японському стилі.",
      styles: ["Неотрадішнл", "Японський", "Геометрія"]
    });
    
    this.createTattooSalon({
      name: "Art Fusion Tattoo",
      address: "вул. Дерибасівська, 5",
      city: "Одеса",
      rating: "4.7",
      image: "https://images.unsplash.com/photo-1580821716522-81fa132dc946?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      description: "Студія креативного тату мистецтва. Спеціалізуємося на унікальних акварельних тату.",
      styles: ["Акварель", "Графіка", "Абстракція"]
    });
    
    // Create sample conversations and messages
    // Conversation with InkMasters
    this.createConversation({
      userId: 1,
      salonId: 1,
      lastMessageAt: new Date(),
      unreadCount: 2
    });
    
    // Messages with InkMasters
    const messageTimestamps = [
      new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      new Date(Date.now() - 1.9 * 60 * 60 * 1000),
      new Date(Date.now() - 1.8 * 60 * 60 * 1000),
      new Date(Date.now() - 1.7 * 60 * 60 * 1000),
      new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    ];
    
    this.createMessage({
      userId: 1,
      salonId: 1,
      content: "Вітаємо! Чим можемо допомогти?",
      timestamp: messageTimestamps[0],
      isFromUser: false
    });
    
    this.createMessage({
      userId: 1,
      salonId: 1,
      content: "Привіт! Я хотів би дізнатися про можливість створення тату в японському стилі",
      timestamp: messageTimestamps[1],
      isFromUser: true
    });
    
    this.createMessage({
      userId: 1,
      salonId: 1,
      content: "Звичайно! У нас є кілька майстрів, які спеціалізуються на японському стилі. Чи є у вас конкретні ідеї або референси?",
      timestamp: messageTimestamps[2],
      isFromUser: false
    });
    
    this.createMessage({
      userId: 1,
      salonId: 1,
      content: "Так, я думав про щось з драконом або карпом кої на передпліччі",
      timestamp: messageTimestamps[3],
      isFromUser: true
    });
    
    this.createMessage({
      userId: 1,
      salonId: 1,
      content: "Чудовий вибір! Ми можемо запропонувати кілька варіантів дизайну. Також можемо використати AI-генерацію з вашого додатку як основу. Коли вам було б зручно прийти на консультацію?",
      timestamp: messageTimestamps[4],
      isFromUser: false
    });
    
    // Conversation with Black Lotus
    this.createConversation({
      userId: 1,
      salonId: 2,
      lastMessageAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      unreadCount: 0
    });
    
    this.createMessage({
      userId: 1,
      salonId: 2,
      content: "Доброго дня! Цікавлять тату в японському стилі.",
      timestamp: new Date(Date.now() - 28 * 60 * 60 * 1000),
      isFromUser: true
    });
    
    this.createMessage({
      userId: 1,
      salonId: 2,
      content: "Дякуємо за звернення! Наш майстер може проконсультувати вас",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      isFromUser: false
    });
    
    // Conversation with Art Fusion
    this.createConversation({
      userId: 1,
      salonId: 3,
      lastMessageAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      unreadCount: 0
    });
    
    this.createMessage({
      userId: 1,
      salonId: 3,
      content: "Привіт! У вас роблять акварельні тату?",
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      isFromUser: true
    });
    
    this.createMessage({
      userId: 1,
      salonId: 3,
      content: "Акварельні тату - це наша спеціалізація",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      isFromUser: false
    });
  }
}

export const storage = new MemStorage();
