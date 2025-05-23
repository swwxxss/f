import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal } from "lucide-react";

interface SalonSearchProps {
  filters: {
    city: string;
    style: string;
    search: string;
  };
  onFilterChange: (filters: { city: string; style: string; search: string }) => void;
}

export default function SalonSearch({ filters, onFilterChange }: SalonSearchProps) {
  // City and style options
  const cities = ["Всі міста", "Київ", "Львів", "Одеса", "Харків", "Дніпро"];
  const styles = ["Всі стилі", "Традиційний", "Реалізм", "Геометричний", "Мінімалізм", "Акварель", "Японський", "Неотрадішнл", "Графіка"];
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, search: e.target.value });
  };
  
  const handleCityChange = (value: string) => {
    onFilterChange({ ...filters, city: value });
  };
  
  const handleStyleChange = (value: string) => {
    onFilterChange({ ...filters, style: value });
  };
  
  return (
    <Card className="bg-secondary rounded-xl overflow-hidden shadow-lg border border-gray-800 p-4 mb-8">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-grow relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-500" />
          </div>
          <Input
            type="text"
            id="search"
            className="pl-10 pr-3 py-2 border border-gray-700 rounded-lg bg-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Пошук салонів або майстрів..."
            value={filters.search}
            onChange={handleSearchChange}
          />
        </div>
        <div className="flex gap-2">
          <Select value={filters.city} onValueChange={handleCityChange}>
            <SelectTrigger className="bg-gray-900 border-gray-700 text-foreground rounded-lg focus:ring-purple-500 focus:border-purple-500 w-[150px]">
              <SelectValue placeholder="Всі міста" />
            </SelectTrigger>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={filters.style} onValueChange={handleStyleChange}>
            <SelectTrigger className="bg-gray-900 border-gray-700 text-foreground rounded-lg focus:ring-purple-500 focus:border-purple-500 w-[150px]">
              <SelectValue placeholder="Всі стилі" />
            </SelectTrigger>
            <SelectContent>
              {styles.map((style) => (
                <SelectItem key={style} value={style}>
                  {style}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            variant="default" 
            className="bg-purple-500 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
