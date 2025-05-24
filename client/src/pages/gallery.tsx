import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import aquarelle from './aquarelle.png';
import neotraditional from './neotraditional.jpg';
import geometric from './geometric.jpg';
import dragon from './dragon.jpg';
import { 
  Image as ImageIcon, 
  Download, 
  Share2, 
  Heart, 
  Bookmark, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  Grid3x3
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface GalleryImage {
  id: number;
  userId: number;
  url: string;
  title: string;
  description: string;
  tags: string[];
  style: string;
  createdAt: string;
  likes: number;
  isPublic: boolean;
}

export default function GalleryPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const currentUserId = 1;

  const { data: images, isLoading } = useQuery<GalleryImage[]>({
    queryKey: ['/api/gallery'],
    queryFn: async () => {
      return [
        {
          id: 1,
          userId: 1,
          url: aquarelle,
          title: "Акварельна рибка",
          description: "Рибка в акварельному стилі виконана у пастельно-бірюзовових кольорах.",
          tags: ["акварель", "риба", "геометрія", "природа"],
          style: "Акварель",
          createdAt: "12.05.2024",
          likes: 24,
          isPublic: true
        },
        {
          id: 2,
          userId: 1,
          url: neotraditional,
          title: "Неотрадиційна тату з дівчиною",
          description: "Дівчина в нео-традиційному стилі з елементами готики.",
          tags: ["люди", "нео-традиційний", "готика", "лисиця", "червоний"],
          style: "Неотрадиційний",
          createdAt: "12.05.2024",
          likes: 18,
          isPublic: true
        },
        {
          id: 3,
          userId: 1,
          url: geometric,
          title: "Геометричний ангел",
          description: "Ангел з елементами геометричних фігур у мінімалістичному стилі.",
          tags: ["геометрія", "ангели", "мінімалізм", "релігія"],
          style: "Геометричний",
          createdAt: "25.05.2025",
          likes: 36,
          isPublic: false
        },
        {
          id: 4,
          userId: 1,
          url: dragon,
          title: "Японський дракон",
          description: "Традиційний японський дракон з елементами сакури.",
          tags: ["японський", "дракон", "сакура"],
          style: "Японський",
          createdAt: "2023-10-28T16:45:00",
          likes: 42,
          isPublic: true
        }
      ];
    }
  });

  const filteredImages = images ? images.filter(image => {
    const matchesSearch = search === "" || 
      image.title.toLowerCase().includes(search.toLowerCase()) || 
      image.description.toLowerCase().includes(search.toLowerCase()) ||
      image.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));

    const matchesStyle = selectedStyle === "" || image.style === selectedStyle;

    const matchesTab =
      selectedTab === "all" ||
      (selectedTab === "my" && image.userId === currentUserId) ||
      (selectedTab === "public" && image.isPublic) ||
      (selectedTab === "private" && !image.isPublic);

    return matchesSearch && matchesStyle && matchesTab;
  }) : [];

  const uniqueStyles = images ? [...new Set(images.map(img => img.style))] : [];

  const handleImageClick = (image: GalleryImage) => {
    setSelectedImage(image);
    setIsDetailDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    toast({
      title: "Видалено",
      description: "Зображення було успішно видалено з галереї"
    });
    setIsDetailDialogOpen(false);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Галерея</h1>
        <p className="text-muted-foreground">Збережені та згенеровані дизайни татуювань</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input 
            className="pl-10" 
            placeholder="Пошук за назвою, описом або тегами..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Grid3x3 className="h-4 w-4" />
            Вигляд
          </Button>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">Всі дизайни</TabsTrigger>
          <TabsTrigger value="my">Мої дизайни</TabsTrigger>
          <TabsTrigger value="public">Публічні</TabsTrigger>
          <TabsTrigger value="private">Приватні</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex gap-2 flex-wrap mb-6">
        <Badge 
          variant={selectedStyle === "" ? "secondary" : "outline"}
          className="cursor-pointer"
          onClick={() => setSelectedStyle("")}
        >
          Всі стилі
        </Badge>
        {uniqueStyles.map(style => (
          <Badge 
            key={style} 
            variant={selectedStyle === style ? "secondary" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedStyle(style)}
          >
            {style}
          </Badge>
        ))}
      </div>
      
      {filteredImages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map(image => (
            <Card 
              key={image.id} 
              className="overflow-hidden cursor-pointer group border-gray-800 hover:border-purple-600 transition-colors"
              onClick={() => handleImageClick(image)}
            >
              <div className="relative h-56">
                <img 
                  src={image.url} 
                  alt={image.title} 
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" 
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  <Badge variant="secondary">
                    {image.style}
                  </Badge>
                  {!image.isPublic && (
                    <Badge variant="outline" className="bg-gray-800/80 border-gray-700">
                      Приватне
                    </Badge>
                  )}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium mb-1">{image.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                  {image.description}
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex flex-wrap gap-1">
                    {image.tags.slice(0, 3).map((tag, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                    {image.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{image.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Heart className="h-4 w-4 mr-1" />
                    <span className="text-sm">{image.likes}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Зображень не знайдено</h3>
          <p className="text-muted-foreground mb-6">
            {search || selectedStyle ? 
              "Спробуйте змінити фільтри пошуку" : 
              "У вас ще немає збережених дизайнів. Створіть ваш перший дизайн!"
            }
          </p>
          <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => window.location.href = "/generate"}>
            Створити дизайн
          </Button>
        </div>
      )}
      
      {/* Діалог деталей зображення */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-4xl">
          {selectedImage && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="overflow-hidden rounded-lg">
                <img 
                  src={selectedImage.url} 
                  alt={selectedImage.title} 
                  className="w-full h-auto object-cover" 
                />
              </div>
              <div>
                <DialogHeader>
                  <DialogTitle className="text-xl">{selectedImage.title}</DialogTitle>
                  <DialogDescription>
                    Створено: {new Date(selectedImage.createdAt).toLocaleDateString('uk-UA')}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="my-4">
                  <h4 className="font-medium mb-1">Опис</h4>
                  <p className="text-muted-foreground">
                    {selectedImage.description}
                  </p>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-medium mb-1">Стиль</h4>
                  <Badge>{selectedImage.style}</Badge>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-medium mb-1">Теги</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedImage.tags.map((tag, i) => (
                      <Badge key={i} variant="outline">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-medium mb-1">Статус</h4>
                  <Badge variant={selectedImage.isPublic ? "secondary" : "outline"}>
                    {selectedImage.isPublic ? "Публічне" : "Приватне"}
                  </Badge>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Завантажити
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Share2 className="h-4 w-4" />
                    Поділитися
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Edit className="h-4 w-4" />
                    Редагувати
                  </Button>
                  <Button 
                    variant="outline" 
                    className="gap-2 text-red-500 hover:text-red-600"
                    onClick={() => handleDelete(selectedImage.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Видалити
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}