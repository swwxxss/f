import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { uk } from "date-fns/locale";
import type { Conversation, TattooSalon } from "@shared/schema";

interface ChatListProps {
  conversations: (Conversation & { salon: TattooSalon })[];
  isLoading: boolean;
  activeConversation: (Conversation & { salon: TattooSalon }) | null;
  onConversationSelect: (conversation: Conversation & { salon: TattooSalon }) => void;
}

export default function ChatList({ 
  conversations, 
  isLoading, 
  activeConversation, 
  onConversationSelect 
}: ChatListProps) {
  const [search, setSearch] = useState("");
  
  // Filter conversations by search term
  const filteredConversations = conversations.filter(
    conv => conv.salon.name.toLowerCase().includes(search.toLowerCase())
  );
  
  // Format timestamp for last message
  const formatTime = (timestamp: Date | string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // If the message is from today, show the time
    if (date.toDateString() === now.toDateString()) {
      return format(date, 'HH:mm', { locale: uk });
    }
    
    // If the message is from yesterday, show "Вчора"
    if (date.toDateString() === yesterday.toDateString()) {
      return "Вчора";
    }
    
    // Otherwise, show the date
    return format(date, 'dd.MM', { locale: uk });
  };
  
  return (
    <Card className="bg-secondary rounded-xl overflow-hidden shadow-lg border border-gray-800 lg:col-span-1">
      <div className="p-4 border-b border-gray-800">
        <div className="relative">
          <Input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg bg-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Пошук в чатах..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-500" />
          </div>
        </div>
      </div>
      
      <ScrollArea className="h-[400px]">
        {isLoading ? (
          // Loading skeleton
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="p-3 flex items-center space-x-3 animate-pulse">
              <div className="w-12 h-12 rounded-full bg-gray-700"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-700 rounded w-full"></div>
              </div>
            </div>
          ))
        ) : filteredConversations.length > 0 ? (
          filteredConversations.map((conv) => {
            const isActive = activeConversation?.salonId === conv.salonId;
            
            return (
              <div 
                key={conv.id}
                className={`p-3 flex items-center space-x-3 cursor-pointer ${
                  isActive ? 'bg-gray-800 border-l-4 border-purple-500' : 'hover:bg-gray-800'
                }`}
                onClick={() => onConversationSelect(conv)}
              >
                <div className="relative">
                  <img 
                    src={conv.salon.image} 
                    alt={conv.salon.name} 
                    className="w-12 h-12 rounded-full object-cover" 
                  />
                  <span className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full border-2 border-secondary ${
                    isActive ? 'bg-green-500' : 'bg-gray-500'
                  }`}></span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{conv.salon.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {/* This would normally show the last message content */}
                    Остання активність
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-muted-foreground">{formatTime(conv.lastMessageAt)}</span>
                  {conv.unreadCount > 0 && (
                    <span className="bg-purple-500 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            Немає активних чатів
          </div>
        )}
      </ScrollArea>
    </Card>
  );
}
