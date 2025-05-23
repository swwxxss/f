import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import SalonSearch from "@/components/community/SalonSearch";
import SalonCard from "@/components/community/SalonCard";
import ChatList from "@/components/community/ChatList";
import ChatWindow from "@/components/community/ChatWindow";
import { TattooSalon, Conversation, Message } from "@shared/schema";

export default function CommunityPage() {
  // Hard-coded user ID for demo purposes
  const userId = 1;
  
  // Search filters state
  const [filters, setFilters] = useState({
    city: "",
    style: "",
    search: ""
  });
  
  // Active conversation state
  const [activeConversation, setActiveConversation] = useState<(Conversation & { salon: TattooSalon }) | null>(null);
  
  // Fetch tattoo salons with filters
  const { 
    data: salons, 
    isLoading: isLoadingSalons 
  } = useQuery<TattooSalon[]>({ 
    queryKey: [
      '/api/salons',
      ...(filters.city ? [`city=${filters.city}`] : []),
      ...(filters.style ? [`style=${filters.style}`] : []),
      ...(filters.search ? [`search=${filters.search}`] : [])
    ],
    refetchOnWindowFocus: false
  });
  
  // Fetch user conversations
  const { 
    data: conversations, 
    isLoading: isLoadingConversations,
    refetch: refetchConversations
  } = useQuery<(Conversation & { salon: TattooSalon })[]>({ 
    queryKey: [`/api/conversations/${userId}`],
    refetchOnWindowFocus: true,
    refetchInterval: 30000 // Refetch every 30 seconds
  });
  
  // Fetch messages for active conversation
  const { 
    data: messages, 
    isLoading: isLoadingMessages,
    refetch: refetchMessages
  } = useQuery<Message[]>({ 
    queryKey: [
      `/api/messages/${userId}/${activeConversation?.salonId || 0}`
    ],
    enabled: !!activeConversation,
    refetchOnWindowFocus: true,
    refetchInterval: activeConversation ? 10000 : false // Refetch every 10 seconds if conversation is active
  });
  
  // Handle search filter changes
  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };
  
  // Handle conversation selection
  const handleConversationSelect = (conversation: (Conversation & { salon: TattooSalon })) => {
    setActiveConversation(conversation);
  };
  
  // Handle starting a new conversation with a salon
  const handleStartConversation = (salon: TattooSalon) => {
    // Find if conversation already exists
    const existingConv = conversations?.find(conv => conv.salonId === salon.id);
    
    if (existingConv) {
      setActiveConversation(existingConv);
    } else {
      // Create a new conversation object
      const newConversation: (Conversation & { salon: TattooSalon }) = {
        id: 0, // Temporary ID
        userId,
        salonId: salon.id,
        lastMessageAt: new Date(),
        unreadCount: 0,
        salon
      };
      
      setActiveConversation(newConversation);
    }
  };
  
  // Handle message sent (refresh conversations and messages)
  const handleMessageSent = () => {
    refetchMessages();
    refetchConversations();
  };
  
  return (
    <section id="community" className="pb-10">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Спільнота тату-мистецтва</h2>
        <p className="text-muted-foreground">Знайдіть салони, майстрів та отримайте консультації</p>
      </div>
      
      {/* Search Bar */}
      <SalonSearch 
        filters={filters} 
        onFilterChange={handleFilterChange} 
      />
      
      {/* Salon List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {isLoadingSalons ? (
          // Loading skeleton
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="bg-secondary rounded-xl overflow-hidden shadow-lg border border-gray-800 animate-pulse">
              <div className="h-48 bg-gray-700"></div>
              <div className="p-5">
                <div className="h-5 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2 mb-3"></div>
                <div className="flex gap-2 mb-3">
                  {Array(3).fill(0).map((_, j) => (
                    <div key={j} className="h-6 bg-gray-700 rounded-full w-16"></div>
                  ))}
                </div>
                <div className="h-4 bg-gray-700 rounded w-full mb-4"></div>
                <div className="flex justify-between">
                  <div className="h-8 bg-gray-700 rounded w-24"></div>
                  <div className="h-8 bg-gray-700 rounded w-24"></div>
                </div>
              </div>
            </div>
          ))
        ) : salons?.length ? (
          salons.map((salon) => (
            <SalonCard 
              key={salon.id} 
              salon={salon} 
              onMessageClick={() => handleStartConversation(salon)} 
            />
          ))
        ) : (
          <div className="col-span-3 text-center py-10">
            <p className="text-muted-foreground">Немає салонів, що відповідають вашим критеріям пошуку</p>
          </div>
        )}
      </div>
      
      {/* Messaging Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Чати з салонами</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat List */}
          <ChatList 
            conversations={conversations || []} 
            isLoading={isLoadingConversations}
            activeConversation={activeConversation}
            onConversationSelect={handleConversationSelect}
          />
          
          {/* Chat Window */}
          <ChatWindow 
            conversation={activeConversation}
            messages={messages || []}
            isLoading={isLoadingMessages}
            userId={userId}
            onMessageSent={handleMessageSent}
          />
        </div>
      </div>
    </section>
  );
}
