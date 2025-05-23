import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, StarHalf, ChevronLeft, MessageSquare, Phone } from "lucide-react";
import { TattooSalon } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function SalonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // Hard-coded user ID for demo purposes
  const userId = 1;
  
  // Fetch salon details
  const { 
    data: salon, 
    isLoading 
  } = useQuery<TattooSalon>({ 
    queryKey: [`/api/salons/${id}`],
    enabled: !!id
  });
  
  // Handle back button click
  const handleBack = () => {
    navigate("/community");
  };
  
  // Handle message button click - start a conversation with the salon
  const handleStartConversation = async () => {
    if (!salon) return;
    
    try {
      // Create a message to start the conversation
      await apiRequest("POST", "/api/messages", {
        userId,
        salonId: salon.id,
        content: `Привіт! Я цікавлюсь вашими послугами.`,
        isFromUser: true
      });
      
      // Redirect to community page where the conversation will be shown
      navigate("/community");
      
      toast({
        title: "Чат створено",
        description: "Ви можете продовжити спілкування в розділі чатів."
      });
    } catch (error) {
      toast({
        title: "Помилка",
        description: "Не вдалося розпочати чат. Спробуйте пізніше.",
        variant: "destructive"
      });
    }
  };
  
  // Render rating stars
  const renderRatingStars = (rating: string) => {
    const ratingNum = parseFloat(rating);
    const fullStars = Math.floor(ratingNum);
    const hasHalfStar = ratingNum % 1 >= 0.5;
    
    return (
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
        ))}
        {hasHalfStar && <StarHalf className="h-4 w-4 text-yellow-400 fill-yellow-400" />}
      </div>
    );
  };
  
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <Button 
          variant="ghost" 
          className="mb-6 text-purple-500"
          onClick={handleBack}
        >
          <ChevronLeft className="mr-1 h-4 w-4" /> Назад до списку
        </Button>
        
        <Card className="bg-secondary rounded-xl overflow-hidden shadow-lg border border-gray-800 mb-6">
          <div className="h-80 bg-gray-700"></div>
          <div className="p-6">
            <div className="h-8 bg-gray-700 rounded w-2/3 mb-3"></div>
            <div className="h-5 bg-gray-700 rounded w-1/3 mb-4"></div>
            <div className="flex gap-2 mb-4">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-6 bg-gray-700 rounded-full w-24"></div>
              ))}
            </div>
            <div className="h-24 bg-gray-700 rounded w-full mb-6"></div>
            <div className="flex justify-between">
              <div className="h-10 bg-gray-700 rounded w-32"></div>
              <div className="h-10 bg-gray-700 rounded w-32"></div>
            </div>
          </div>
        </Card>
      </div>
    );
  }
  
  if (!salon) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-4">Салон не знайдено</h2>
        <Button 
          variant="default" 
          className="bg-purple-500 hover:bg-purple-700"
          onClick={handleBack}
        >
          Повернутися до списку
        </Button>
      </div>
    );
  }
  
  return (
    <div>
      <Button 
        variant="ghost" 
        className="mb-6 text-purple-500"
        onClick={handleBack}
      >
        <ChevronLeft className="mr-1 h-4 w-4" /> Назад до списку
      </Button>
      
      <Card className="bg-secondary rounded-xl overflow-hidden shadow-lg border border-gray-800 mb-6">
        <img 
          src={salon.image} 
          alt={salon.name} 
          className="w-full h-80 object-cover"
        />
        
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">{salon.name}</h1>
              <div className="flex items-center mb-4">
                <MapPin className="h-4 w-4 text-purple-500 mr-1" />
                <span className="text-muted-foreground">{salon.city}, {salon.address}</span>
              </div>
            </div>
            
            <div className="flex items-center mt-2 md:mt-0">
              <span className="text-xl font-medium text-yellow-400 mr-2">{salon.rating}</span>
              {renderRatingStars(salon.rating)}
            </div>
          </div>
          
          <div className="mb-6 flex flex-wrap gap-2">
            {salon.styles.map((style, index) => (
              <Badge key={index} variant="secondary" className="bg-gray-800 text-foreground px-3 py-1">
                {style}
              </Badge>
            ))}
          </div>
          
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-2">Про салон</h2>
            <p className="text-muted-foreground">{salon.description}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              variant="default" 
              className="bg-purple-500 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex-1"
              onClick={handleStartConversation}
            >
              <MessageSquare className="mr-2 h-5 w-5" /> Написати повідомлення
            </Button>
            
            <Button 
              variant="outline" 
              className="border-gray-700 hover:bg-gray-800 text-foreground px-4 py-2 rounded-lg flex-1"
            >
              <Phone className="mr-2 h-5 w-5" /> Зателефонувати
            </Button>
          </div>
        </div>
      </Card>
      
      {/* Portfolio section could be added here */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Портфоліо робіт</h2>
        <p className="text-muted-foreground">Портфоліо майстрів цього салону буде доступне незабаром.</p>
      </div>
    </div>
  );
}
