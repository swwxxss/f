import { useQuery } from "@tanstack/react-query";
import SubscriptionCard from "@/components/subscriptions/SubscriptionCard";
import SubscriptionHistory from "@/components/subscriptions/SubscriptionHistory";
import { SubscriptionPlan, UserSubscription } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function SubscriptionsPage() {
  const { toast } = useToast();
  
  // Hard-coded user ID for demo purposes
  const userId = 1;
  
  // Fetch subscription plans
  const { 
    data: plans, 
    isLoading: isLoadingPlans 
  } = useQuery<SubscriptionPlan[]>({ 
    queryKey: ['/api/subscription-plans'] 
  });
  
  // Fetch user subscriptions
  const { 
    data: subscriptions, 
    isLoading: isLoadingSubscriptions,
    refetch: refetchSubscriptions
  } = useQuery<(UserSubscription & { plan: SubscriptionPlan })[]>({ 
    queryKey: [`/api/user-subscriptions/${userId}`] 
  });
  
  // Subscribe to a plan
  const handleSubscribe = async (planId: number) => {
    try {
      await apiRequest('POST', '/api/subscribe', { userId, planId });
      await refetchSubscriptions();
      toast({
        title: "Успішно підписано!",
        description: "Вашу підписку було успішно активовано.",
        variant: "success"
      });
    } catch (error) {
      toast({
        title: "Помилка підписки",
        description: "Не вдалося оформити підписку. Спробуйте пізніше.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <section id="subscription" className="pb-10">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Підписки на генерування тату</h2>
        <p className="text-muted-foreground">Оберіть план, що відповідає вашим потребам</p>
      </div>
      
      {/* Subscription Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoadingPlans ? (
          // Loading skeleton
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="bg-secondary rounded-xl overflow-hidden shadow-lg border border-gray-800 p-6 animate-pulse">
              <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
              <div className="h-8 bg-gray-700 rounded w-1/2 mb-6"></div>
              <div className="space-y-3 mb-6">
                {Array(4).fill(0).map((_, j) => (
                  <div key={j} className="h-4 bg-gray-700 rounded w-full"></div>
                ))}
              </div>
              <div className="h-10 bg-gray-700 rounded w-full"></div>
            </div>
          ))
        ) : plans?.map((plan) => (
          <SubscriptionCard 
            key={plan.id} 
            plan={plan} 
            onSubscribe={() => handleSubscribe(plan.id)} 
          />
        ))}
      </div>
      
      {/* Subscription History */}
      <SubscriptionHistory 
        subscriptions={subscriptions || []} 
        isLoading={isLoadingSubscriptions} 
      />
    </section>
  );
}
