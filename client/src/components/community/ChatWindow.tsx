import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Phone, Video, Info, PaperclipIcon, Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Conversation, TattooSalon, Message } from "@shared/schema";

interface ChatWindowProps {
  conversation: (Conversation & { salon: TattooSalon }) | null;
  messages: Message[];
  isLoading: boolean;
  userId: number;
  onMessageSent: () => void;
}

export default function ChatWindow({ 
  conversation, 
  messages, 
  isLoading, 
  userId,
  onMessageSent 
}: ChatWindowProps) {
  const [newMessage, setNewMessage] = useState("");
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // Send message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !conversation) return;
    
    try {
      await apiRequest("POST", "/api/messages", {
        userId,
        salonId: conversation.salonId,
        content: newMessage,
        isFromUser: true
      });
      
      setNewMessage("");
      onMessageSent();
    } catch (error) {
      toast({
        title: "Помилка відправлення",
        description: "Не вдалося відправити повідомлення. Спробуйте ще раз.",
        variant: "destructive"
      });
    }
  };
  
  // Handle enter key press
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Format message timestamp
  const formatMessageTime = (timestamp: Date | string) => {
    return format(new Date(timestamp), "HH:mm");
  };
  
  // If no conversation is selected
  if (!conversation) {
    return (
      <Card className="bg-secondary rounded-xl overflow-hidden shadow-lg border border-gray-800 lg:col-span-2 flex items-center justify-center p-10">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2">Оберіть чат або почніть новий</h3>
          <p className="text-muted-foreground">
            Виберіть розмову зі списку або почніть нову, натиснувши "Написати" на картці салону
          </p>
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="bg-secondary rounded-xl overflow-hidden shadow-lg border border-gray-800 lg:col-span-2">
      {/* Chat header */}
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img 
            src={conversation.salon.image} 
            alt={conversation.salon.name} 
            className="w-10 h-10 rounded-full object-cover" 
          />
          <div>
            <h4 className="font-medium">{conversation.salon.name}</h4>
            <p className="text-xs text-green-500">Онлайн</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button size="icon" variant="ghost" className="text-gray-400 hover:text-purple-500 rounded-full">
            <Phone className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" className="text-gray-400 hover:text-purple-500 rounded-full">
            <Video className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" className="text-gray-400 hover:text-purple-500 rounded-full">
            <Info className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Chat messages */}
      <ScrollArea className="p-4 overflow-y-auto flex flex-col space-y-4" style={{ height: "300px" }}>
        {isLoading ? (
          // Loading skeleton
          <div className="flex flex-col space-y-4">
            <div className="flex items-end">
              <div className="w-8 h-8 rounded-full bg-gray-700 mr-2"></div>
              <div className="max-w-[80%] rounded-xl p-3 bg-gray-800 animate-pulse">
                <div className="h-4 bg-gray-700 rounded w-24 mb-1"></div>
                <div className="h-3 bg-gray-700 rounded w-16"></div>
              </div>
            </div>
            <div className="flex items-end justify-end">
              <div className="max-w-[80%] rounded-xl p-3 bg-gray-800 animate-pulse">
                <div className="h-4 bg-gray-700 rounded w-32 mb-1"></div>
                <div className="h-3 bg-gray-700 rounded w-16"></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex items-end ${message.isFromUser ? "justify-end" : ""}`}
              >
                {!message.isFromUser && (
                  <img 
                    src={conversation.salon.image} 
                    alt={conversation.salon.name} 
                    className="w-8 h-8 rounded-full mr-2" 
                  />
                )}
                <div 
                  className={`p-3 text-sm max-w-[80%] rounded-xl ${
                    message.isFromUser 
                      ? "bg-purple-500 text-white rounded-br-sm" 
                      : "bg-gray-800 rounded-bl-sm"
                  }`}
                >
                  <p>{message.content}</p>
                  <span className={`text-xs mt-1 block ${
                    message.isFromUser ? "text-gray-300" : "text-gray-400"
                  }`}>
                    {formatMessageTime(message.timestamp)}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>
      
      {/* Message input */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center">
          <Button size="icon" variant="ghost" className="text-gray-400 hover:text-purple-500 rounded-full">
            <PaperclipIcon className="h-4 w-4" />
          </Button>
          <div className="flex-grow mx-2">
            <Input
              type="text"
              className="block w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Введіть повідомлення..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <Button 
            size="icon" 
            variant="default" 
            className="bg-purple-500 text-white rounded-full hover:bg-purple-700"
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
