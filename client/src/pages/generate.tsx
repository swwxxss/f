import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { CheckIcon, ImageIcon, RotateCcwIcon, Download, Share2Icon, Bookmark, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";


export default function AIGeneratorPage() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("realistic");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [creativity, setCreativity] = useState([50]);
  const { toast } = useToast();



  const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

  const styles = [
    { id: "realistic", name: "Реалістичний" },
    { id: "watercolor", name: "Акварель" },
    { id: "sketch", name: "Ескіз" },
    { id: "neo-traditional", name: "Нео-традиційний" },
    { id: "geometric", name: "Геометричний" },
    { id: "tribal", name: "Трайбл" },
    { id: "blackwork", name: "Блекворк" },
    { id: "dotwork", name: "Дотворк" },
    { id: "japanese", name: "Японський" }
  ];

  const handleGenerate = () => {
    setIsGenerating(true);
    
    // Симуляція генерації зображення
    setTimeout(() => {
      // Замість фіктивного зображення тут буде API-запит
      setGeneratedImage("https://images.unsplash.com/photo-1649754621638-a7ae3dfba087?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MDEyNjM2NzF8&ixlib=rb-4.0.3&q=85");
      setIsGenerating(false);
    }, 2000);
  };
const generateTattoo = async () => {
  setIsGenerating(true);


  const prompt = `A tattoo design in ${style} style, size: 256x256, black ink only.`;
  try {
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "dall-e-2",
        prompt: prompt,
        n: 1,
        size: "256x256", // можна збільшити, наприклад: "1024x1024"
      }),
    });

    const data = await response.json();

    if (data?.data?.[0]?.url) {
      setGeneratedImage(data.data[0].url);
    } else {
      console.error("Помилка генерації:", data);
      alert("Не вдалося згенерувати зображення. Спробуйте ще раз.");
    }
  } catch (error) {
    console.error("Помилка під час запиту:", error);
    alert("Щось пішло не так. Перевірте API ключ або інтернет-з'єднання.");
  } finally {
    setIsGenerating(false);
  }
};

  const handleReset = () => {
    setPrompt("");
    setStyle("realistic");
    setNegativePrompt("");
    setCreativity([50]);
    setGeneratedImage(null);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Ліва панель */}
      <div className="flex-1">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">AI Generator</h1>
          <p className="text-muted-foreground">Створюйте унікальні дизайни татуювань за допомогою штучного інтелекту</p>
        </div>
        
        <Tabs defaultValue="text-to-image" className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="text-to-image">Текст в зображення</TabsTrigger>
            <TabsTrigger value="image-to-image">Зображення в зображення</TabsTrigger>
          </TabsList>
          
          <TabsContent value="text-to-image">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Опис татуювання</label>
                <Textarea 
                  placeholder="Опишіть докладно, яке татуювання ви хочете створити..."
                  className="h-28"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Стиль</label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger>
                    <SelectValue placeholder="Оберіть стиль" />
                  </SelectTrigger>
                  <SelectContent>
                    {styles.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              

              
              <div className="flex gap-3">
                <Button 
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                  onClick={generateTattoo}
                  disabled={!prompt || isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Генерація...
                    </>
                  ) : (
                    <>Згенерувати</>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleReset}
                >
                  <RotateCcwIcon className="h-4 w-4 mr-1" />
                  Скинути
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="image-to-image">
            <div className="flex items-center justify-center h-40 mb-4 border-2 border-dashed border-gray-600 rounded-lg">
              <div className="text-center">
                <ImageIcon className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                <Button variant="secondary">Завантажити зображення</Button>
                <p className="mt-2 text-sm text-muted-foreground">Або перетягніть файл сюди</p>
              </div>
            </div>
            
            <div className="text-center mb-4">
              <p className="text-muted-foreground">
                Ця функція буде доступна найближчим часом.
              </p>
              <Badge variant="secondary" className="mt-2">У розробці</Badge>
            </div>
          </TabsContent>
        </Tabs>
        

      </div>
      
      {/* Права панель */}
      <div className="flex-1">
        {generatedImage ? (
          <div className="space-y-4">
            <div className="bg-secondary rounded-lg overflow-hidden border border-gray-800">
              <img 
                src={generatedImage} 
                alt="Згенероване татуювання" 
                className="w-full h-auto object-cover"
              />
              <div className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Згенероване зображення</h3>
                    <p className="text-sm text-muted-foreground">Стиль: {styles.find(s => s.id === style)?.name}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                      <Share2Icon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700"
                onClick={handleGenerate}
              >
                Згенерувати ще
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    // Логіка збереження в галерею
                    toast({
                      title: "Збережено в галерею",
                      description: "Дизайн був успішно збережений у вашу галерею"
                    });
                    setTimeout(() => {
                      window.location.href = "/gallery";
                    }, 1500);
                  }}
                >
                  Зберегти в галерею
                </Button>
                <Button variant="outline" className="w-full">
                  Налаштувати деталі
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center border border-dashed border-gray-700 rounded-lg bg-muted/50 p-8">
            <div className="text-center">
              <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Тут з'явиться ваше зображення</h3>
              <p className="text-muted-foreground mb-4">
                Заповніть параметри зліва та натисніть "Згенерувати", щоб створити унікальне татуювання
              </p>
              {!prompt && (
                <p className="text-sm text-amber-500">
                  Спочатку додайте опис тату, який ви хочете створити
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}