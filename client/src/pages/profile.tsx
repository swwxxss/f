import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { User, EditIcon, Bell, CreditCard, Lock, LogOut, Award, BarChart3, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Інтерфейс для даних користувача
interface UserProfile {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  bio: string;
  location: string;
  statistics: {
    designsCreated: number;
    designsSaved: number;
    designsShared: number;
    subscriptionDays: number;
  };
  preferences: {
    newsletter: boolean;
    notifications: boolean;
    darkMode: boolean;
    publicProfile: boolean;
  };
  subscription: {
    plan: string;
    status: string;
    renewalDate: string;
    designsLeft: number;
  };
}

export default function ProfilePage() {
  const { toast } = useToast();
  const [editMode, setEditMode] = useState(false);
  
  // Тимчасові стани для редагування
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  
  // Запит для отримання даних користувача
  const { data: user, isLoading } = useQuery<UserProfile>({
    queryKey: ['/api/user/profile'],
    queryFn: async () => {
      // Симуляція отримання даних користувача
      return {
        id: 1,
        name: "Олександр Петренко",
        email: "oleksandr@example.com",
        bio: "Творчий ентузіаст з пристрастю до мистецтва та дизайну. Люблю експериментувати з різними стилями татуювань.",
        location: "Київ, Україна",
        statistics: {
          designsCreated: 15,
          designsSaved: 27,
          designsShared: 8,
          subscriptionDays: 67
        },
        preferences: {
          newsletter: true,
          notifications: true,
          darkMode: true,
          publicProfile: false
        },
        subscription: {
          plan: "Преміум",
          status: "Активна",
          renewalDate: "2023-12-15",
          designsLeft: 18
        }
      };
    },
    onSuccess: (data) => {
      setName(data.name);
      setBio(data.bio);
      setLocation(data.location);
    }
  });
  
  // Обробник збереження змін профілю
  const handleSaveProfile = () => {
    // У реальному проекті тут буде API-запит для оновлення профілю
    toast({
      title: "Профіль оновлено",
      description: "Ваші зміни були успішно збережені",
    });
    setEditMode(false);
  };
  
  // Обробник зміни налаштувань
  const handleToggleSetting = (setting: string, value: boolean) => {
    // У реальному проекті тут буде API-запит для оновлення налаштувань
    toast({
      title: "Налаштування оновлені",
      description: `Налаштування "${setting}" змінено`
    });
  };
  
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="flex items-center mb-6">
          <div className="rounded-full bg-gray-700 h-20 w-20 mr-6"></div>
          <div className="flex-1">
            <div className="h-6 bg-gray-700 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-1/3"></div>
          </div>
        </div>
        <div className="mb-6">
          <div className="h-10 bg-gray-700 rounded w-full mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-24 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-4">Користувача не знайдено</h2>
        <p className="text-muted-foreground mb-6">Не вдалося завантажити інформацію профілю</p>
        <Button 
          variant="default" 
          className="bg-purple-600 hover:bg-purple-700"
          onClick={() => window.location.reload()}
        >
          Спробувати знову
        </Button>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
          <div className="flex items-center mb-4 sm:mb-0">
            <Avatar className="h-24 w-24 mr-6 border-2 border-purple-500">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="bg-gray-800 text-xl">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div>
              {editMode ? (
                <Input 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-xl font-bold mb-2 max-w-xs"
                />
              ) : (
                <h1 className="text-2xl font-bold mb-1">{user.name}</h1>
              )}
              <div className="flex items-center text-muted-foreground">
                <span>{user.email}</span>
                <Badge variant="secondary" className="ml-2 bg-purple-800 text-purple-100">
                  {user.subscription.plan}
                </Badge>
              </div>
            </div>
          </div>
          
          {editMode ? (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setEditMode(false)}
              >
                Скасувати
              </Button>
              <Button 
                className="bg-purple-600 hover:bg-purple-700"
                onClick={handleSaveProfile}
              >
                Зберегти зміни
              </Button>
            </div>
          ) : (
            <Button 
              variant="outline" 
              onClick={() => setEditMode(true)}
            >
              <EditIcon className="h-4 w-4 mr-2" /> Редагувати профіль
            </Button>
          )}
        </div>
        
        {editMode ? (
          <div className="grid gap-4 mb-6">
            <div>
              <Label htmlFor="bio">Про себе</Label>
              <Input 
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="location">Місцезнаходження</Label>
              <Input 
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>
        ) : (
          <div className="mb-6">
            <p className="text-muted-foreground mb-2">{user.bio}</p>
            <div className="flex items-center text-sm text-muted-foreground">
              <span>{user.location}</span>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 text-center bg-muted border-gray-700">
            <div className="text-2xl font-bold text-purple-500">{user.statistics.designsCreated}</div>
            <div className="text-sm text-muted-foreground">Створено дизайнів</div>
          </Card>
          <Card className="p-4 text-center bg-muted border-gray-700">
            <div className="text-2xl font-bold text-purple-500">{user.statistics.designsSaved}</div>
            <div className="text-sm text-muted-foreground">Збережено дизайнів</div>
          </Card>
          <Card className="p-4 text-center bg-muted border-gray-700">
            <div className="text-2xl font-bold text-purple-500">{user.statistics.designsShared}</div>
            <div className="text-sm text-muted-foreground">Поширено дизайнів</div>
          </Card>
          <Card className="p-4 text-center bg-muted border-gray-700">
            <div className="text-2xl font-bold text-purple-500">{user.statistics.subscriptionDays}</div>
            <div className="text-sm text-muted-foreground">Днів підписки</div>
          </Card>
        </div>
      </div>
      
      <Tabs defaultValue="subscription">
        <TabsList className="mb-6">
          <TabsTrigger value="subscription">Підписка</TabsTrigger>
          <TabsTrigger value="settings">Налаштування</TabsTrigger>
          <TabsTrigger value="statistics">Статистика</TabsTrigger>
        </TabsList>
        
        <TabsContent value="subscription" className="space-y-4">
          <Card className="p-6 border-gray-700">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium mb-1">План {user.subscription.plan}</h3>
                <p className="text-sm text-muted-foreground">Статус: {user.subscription.status}</p>
              </div>
              <Button variant="outline">Змінити план</Button>
            </div>
            
            <div className="grid gap-4 mb-6">
              <div className="flex justify-between pb-2 border-b border-gray-700">
                <span className="text-muted-foreground">Дата поновлення</span>
                <span>{new Date(user.subscription.renewalDate).toLocaleDateString('uk-UA')}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-gray-700">
                <span className="text-muted-foreground">Залишилось дизайнів</span>
                <span>{user.subscription.designsLeft}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Метод оплати</span>
                <span className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-2" /> ****1234
                </span>
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" className="text-red-500 hover:text-red-600">
                Скасувати підписку
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700">
                Керувати платежами
              </Button>
            </div>
          </Card>
          
          <Card className="p-6 border-gray-700">
            <h3 className="text-lg font-medium mb-4">Історія платежів</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                <div>
                  <div className="font-medium">План Преміум</div>
                  <div className="text-sm text-muted-foreground">15.11.2023</div>
                </div>
                <div className="text-right">
                  <div>399 грн</div>
                  <div className="text-sm text-green-500">Оплачено</div>
                </div>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                <div>
                  <div className="font-medium">План Базовий</div>
                  <div className="text-sm text-muted-foreground">15.10.2023</div>
                </div>
                <div className="text-right">
                  <div>199 грн</div>
                  <div className="text-sm text-green-500">Оплачено</div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">Пробний період</div>
                  <div className="text-sm text-muted-foreground">15.09.2023</div>
                </div>
                <div className="text-right">
                  <div>0 грн</div>
                  <div className="text-sm text-green-500">Безкоштовно</div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <Card className="p-6 border-gray-700">
            <h3 className="text-lg font-medium mb-4">Загальні налаштування</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="newsletter">Отримувати новини</Label>
                  <div className="text-sm text-muted-foreground">
                    Надсилати мені інформацію про новинки та оновлення
                  </div>
                </div>
                <Switch 
                  id="newsletter" 
                  checked={user.preferences.newsletter}
                  onCheckedChange={(checked) => handleToggleSetting('newsletter', checked)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Сповіщення</Label>
                  <div className="text-sm text-muted-foreground">
                    Отримувати сповіщення про нові функції та події
                  </div>
                </div>
                <Switch 
                  id="notifications" 
                  checked={user.preferences.notifications}
                  onCheckedChange={(checked) => handleToggleSetting('notifications', checked)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="darkMode">Темна тема</Label>
                  <div className="text-sm text-muted-foreground">
                    Використовувати темну тему інтерфейсу
                  </div>
                </div>
                <Switch 
                  id="darkMode" 
                  checked={user.preferences.darkMode}
                  onCheckedChange={(checked) => handleToggleSetting('darkMode', checked)}
                />
              </div>
            </div>
          </Card>
          
          <Card className="p-6 border-gray-700">
            <h3 className="text-lg font-medium mb-4">Приватність</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="publicProfile">Публічний профіль</Label>
                  <div className="text-sm text-muted-foreground">
                    Дозволити іншим користувачам бачити ваш профіль
                  </div>
                </div>
                <Switch 
                  id="publicProfile" 
                  checked={user.preferences.publicProfile}
                  onCheckedChange={(checked) => handleToggleSetting('publicProfile', checked)}
                />
              </div>
            </div>
          </Card>
          
          <Card className="p-6 border-gray-700">
            <h3 className="text-lg font-medium mb-4">Безпека</h3>
            
            <div className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <Lock className="h-4 w-4 mr-2" />
                Змінити пароль
              </Button>
              
              <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
                <LogOut className="h-4 w-4 mr-2" />
                Вийти з усіх пристроїв
              </Button>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="statistics" className="space-y-4">
          <Card className="p-6 border-gray-700">
            <h3 className="text-lg font-medium mb-4">Статистика використання</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                <BarChart3 className="h-8 w-8 text-purple-500 mb-2" />
                <div className="text-2xl font-bold">{user.statistics.designsCreated}</div>
                <div className="text-sm text-muted-foreground">Дизайнів створено</div>
              </div>
              <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                <ImageIcon className="h-8 w-8 text-purple-500 mb-2" />
                <div className="text-2xl font-bold">{user.statistics.designsSaved}</div>
                <div className="text-sm text-muted-foreground">Дизайнів збережено</div>
              </div>
              <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                <Award className="h-8 w-8 text-purple-500 mb-2" />
                <div className="text-2xl font-bold">{user.statistics.subscriptionDays}</div>
                <div className="text-sm text-muted-foreground">Днів з нами</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Активність за останній місяць</h4>
                <div className="w-full h-20 bg-gray-800 rounded-lg flex items-end p-2">
                  {[5, 8, 2, 10, 15, 7, 3, 12, 9, 6, 8, 14].map((value, i) => (
                    <div 
                      key={i} 
                      className="flex-1 bg-purple-600 mx-0.5 rounded-t-sm"
                      style={{ height: `${value * 5}%` }} 
                    />
                  ))}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>1 тиж</span>
                  <span>2 тиж</span>
                  <span>3 тиж</span>
                  <span>4 тиж</span>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Популярні стилі</h4>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Японський</span>
                      <span>45%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div className="bg-purple-600 h-full rounded-full" style={{ width: "45%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Геометричний</span>
                      <span>30%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div className="bg-purple-600 h-full rounded-full" style={{ width: "30%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Акварель</span>
                      <span>25%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div className="bg-purple-600 h-full rounded-full" style={{ width: "25%" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}