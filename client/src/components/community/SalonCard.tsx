import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Eye, MessageSquare, Star, StarHalf } from "lucide-react";
import { useLocation } from "wouter";
import type { TattooSalon } from "@shared/schema";

interface SalonCardProps {
  salon: TattooSalon;
  onMessageClick: () => void;
}

export default function SalonCard({ salon, onMessageClick }: SalonCardProps) {
  const [, navigate] = useLocation();
  
  const handleViewDetails = () => {
    navigate(`/salon/${salon.id}`);
  };
  
  // Render rating stars
  const renderRatingStars = (rating: string) => {
    const ratingNum = parseFloat(rating);
    const fullStars = Math.floor(ratingNum);
    const hasHalfStar = ratingNum % 1 >= 0.5;
    
    return (
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="h-3 w-3 text-yellow-400 fill-yellow-400" />
        ))}
        {hasHalfStar && <StarHalf className="h-3 w-3 text-yellow-400 fill-yellow-400" />}
      </div>
    );
  };
  
  return (
    <Card className="bg-secondary rounded-xl overflow-hidden shadow-lg border border-gray-800 hover:border-purple-500 transition-colors">
      <img 
        className="w-full h-48 object-cover" 
        src={salon.image} 
        alt={salon.name} 
      />
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold mb-1">{salon.name}</h3>
            <div className="flex items-center mb-2">
              <MapPin className="h-4 w-4 text-purple-500 mr-1" />
              <span className="text-sm text-muted-foreground">{salon.city}, {salon.address}</span>
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-yellow-400 mr-1">{salon.rating}</span>
            {renderRatingStars(salon.rating)}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {salon.styles.map((style, index) => (
            <Badge key={index} variant="secondary" className="bg-gray-800 text-foreground text-xs px-2 py-1 rounded-full">
              {style}
            </Badge>
          ))}
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">{salon.description}</p>
        
        <div className="flex justify-between">
          <Button 
            variant="secondary" 
            className="bg-gray-800 hover:bg-gray-700 text-foreground px-3 py-2 rounded-lg text-sm"
            onClick={handleViewDetails}
          >
            <Eye className="h-4 w-4 mr-1" /> Детальніше
          </Button>
          
          <Button 
            variant="default" 
            className="bg-purple-500 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-sm"
            onClick={onMessageClick}
          >
            <MessageSquare className="h-4 w-4 mr-1" /> Написати
          </Button>
        </div>
      </div>
    </Card>
  );
}
