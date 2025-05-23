import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import type { SubscriptionPlan } from "@shared/schema";

interface SubscriptionCardProps {
  plan: SubscriptionPlan;
  onSubscribe: () => void;
}

export default function SubscriptionCard({ plan, onSubscribe }: SubscriptionCardProps) {
  const formatPrice = (price: number) => {
    return `${price}₴`;
  };
  
  return (
    <Card className={`bg-secondary rounded-xl overflow-hidden shadow-lg border ${
      plan.isBest 
        ? 'border-purple-500 transition-colors relative' 
        : 'border-gray-800 hover:border-purple-500 transition-colors'
    }`}>
      {plan.isBest && (
        <div className="absolute top-0 left-0 w-full bg-purple-500 text-white text-center text-xs py-1 font-medium">
          Найкраща цінність
        </div>
      )}
      
      <div className={`p-6 ${plan.isBest ? 'pt-8' : ''}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">{plan.name}</h3>
          {plan.isPopular && (
            <Badge variant="secondary" className="bg-gray-800 text-foreground">
              Популярний
            </Badge>
          )}
        </div>
        
        <div className="mb-6">
          <span className="text-3xl font-bold">{formatPrice(plan.price)}</span>
          <span className="text-muted-foreground">/{plan.interval}</span>
        </div>
        
        <ul className="space-y-3 mb-6">
          {plan.features.map((feature, index) => {
            const isUnavailable = feature.startsWith("Преміум стилі") && plan.name === "Базовий";
            
            return (
              <li key={index} className={`flex items-start ${isUnavailable ? 'text-muted-foreground' : ''}`}>
                {isUnavailable ? (
                  <X className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                ) : (
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                )}
                <span>{feature}</span>
              </li>
            );
          })}
        </ul>
        
        <Button 
          className="w-full py-3 bg-purple-500 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
          onClick={onSubscribe}
        >
          Обрати план
        </Button>
      </div>
    </Card>
  );
}
