import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  Sparkles, 
  Palette, 
  Zap, 
  Layers, 
  Share2, 
  Lock, 
  Star, 
  ArrowRight,
  Image as ImageIcon,
  MessagesSquare,
  Crown,
  BookOpen
} from "lucide-react";

export default function HomePage() {
  // Особливості продукту
  const features = [
    {
      title: "AI Генерація",
      description: "Створюйте унікальні дизайни татуювань за допомогою штучного інтелекту",
      icon: <Sparkles className="h-10 w-10 text-purple-500" />
    },
    {
      title: "Різноманітні стилі",
      description: "Вибирайте з десятків стилів від реалістичних до геометричних",
      icon: <Palette className="h-10 w-10 text-purple-500" />
    },
    {
      title: "Швидкий результат",
      description: "Отримуйте зображення високої якості за декілька секунд",
      icon: <Zap className="h-10 w-10 text-purple-500" />
    },
    {
      title: "Персоналізація",
      description: "Налаштування та редагування дизайнів під ваші потреби",
      icon: <Layers className="h-10 w-10 text-purple-500" />
    },
    {
      title: "Спільнота",
      description: "Зв'язуйтесь із салонами татуювань для консультацій",
      icon: <MessagesSquare className="h-10 w-10 text-purple-500" />
    },
    {
      title: "Приватність",
      description: "Ваші дизайни належать тільки вам і захищені від копіювання",
      icon: <Lock className="h-10 w-10 text-purple-500" />
    }
  ];
  
  const testimonials = [
    {
      text: "За допомогою Sin&Skin я створив унікальний дизайн татуювання, який став моїм першим тату. Процес був простим і захоплюючим!",
      author: "Марк К.",
      role: "Користувач",
      rating: 5
    },
    {
      text: "Як майстер тату-салону, я використовую цей додаток для швидкого створення концептів для клієнтів. Це економить час і допомагає краще зрозуміти їхні бажання.",
      author: "Анна Р.",
      role: "Тату-майстер",
      rating: 5
    },
    {
      text: "Вражаюче, наскільки реалістичні дизайни можна створити. Я знайшов свій стиль і тепер постійно експериментую з новими ідеями.",
      author: "Денис М.",
      role: "Дизайнер",
      rating: 4
    }
  ];
  
  // Тарифні плани
  const plans = [
    {
      name: "Базовий",
      price: 199,
      period: "на місяць",
      description: "Ідеально для тих, хто хоче спробувати",
      features: ["5 дизайнів на місяць", "Стандартні стилі", "Базова персоналізація", "Збереження в галерею"],
      popular: false
    },
    {
      name: "Преміум",
      price: 399,
      period: "на місяць",
      description: "Найпопулярніший вибір користувачів",
      features: ["25 дизайнів на місяць", "Усі стилі та інструменти", "Розширена персоналізація", "Пріоритетна підтримка", "Без водяних знаків"],
      popular: true
    },
    {
      name: "Про",
      price: 999,
      period: "на місяць",
      description: "Для професійних тату-майстрів",
      features: ["Необмежена кількість дизайнів", "Комерційне використання", "Багатокористувацький доступ", "Професійні інструменти", "Особистий менеджер"],
      popular: false
    }
  ];
  
  return (
    <div className="space-y-20">
      {/* Hero секція */}
      <section className="relative pt-10 pb-20 text-center">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary to-black opacity-40 pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto px-4">
          <Badge className="mb-4 px-3 py-1 bg-purple-900/60 text-purple-200 border-purple-700">
            ЗАПУЩЕНО БЕТА-ВЕРСІЮ
          </Badge>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-amber-500">
            Створюйте унікальні тату-дизайни за допомогою штучного інтелекту
          </h1>
          
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Sin&Skin допомагає створювати персоналізовані татуювання під ваші унікальні ідеї та стиль, використовуючи передову AI технологію
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-purple-600 hover:bg-purple-700 text-lg"
              onClick={() => window.location.href = "/generate"}
            >
              Почати створювати <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg"
              onClick={() => window.location.href = "/subscriptions"}
            >
              Тарифні плани <Crown className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
      
      {/* Приклади генерації */}
      <section className="relative py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Приклади дизайнів</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Погляньте, які дивовижні татуювання створили наші користувачі за допомогою штучного інтелекту
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="group relative">
              <div className="overflow-hidden rounded-lg">
                <img 
                  src="https://images.unsplash.com/photo-1611501156699-bb36469fcead?q=80&w=2070&auto=format&fit=crop" 
                  alt="Тату дизайн" 
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="absolute top-2 right-2">
                <Badge className="bg-purple-800 text-purple-100">Акварель</Badge>
              </div>
            </div>
            <div className="group relative">
              <div className="overflow-hidden rounded-lg">
                <img 
                  src="https://images.unsplash.com/photo-1571987502227-9231b837d92a?q=80&w=1974&auto=format&fit=crop" 
                  alt="Тату дизайн" 
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="absolute top-2 right-2">
                <Badge className="bg-purple-800 text-purple-100">Нео-традиційний</Badge>
              </div>
            </div>
            <div className="group relative">
              <div className="overflow-hidden rounded-lg">
                <img 
                  src="https://images.unsplash.com/photo-1542727365-19732a80dcfd?q=80&w=1974&auto=format&fit=crop" 
                  alt="Тату дизайн" 
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="absolute top-2 right-2">
                <Badge className="bg-purple-800 text-purple-100">Геометричний</Badge>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-10">
            <Button 
              variant="outline"
              onClick={() => window.location.href = "/gallery"}
            >
              Переглянути усі дизайни <ImageIcon className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
      
      {/* Особливості продукту */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-primary">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Чому саме Sin&Skin?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Наш додаток пропонує унікальні можливості для створення та персоналізації ваших тату-дизайнів
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <Card key={i} className="p-6 border-gray-800 bg-muted hover:border-purple-500 transition-colors">
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Відгуки користувачів */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Що кажуть користувачі?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Приєднуйтесь до тисяч задоволених користувачів, які вже використовують Sin&Skin
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <Card key={i} className="p-6 border-gray-800 bg-secondary">
                <div className="mb-4 flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} />
                  ))}
                </div>
                <p className="text-muted-foreground italic mb-6">"{testimonial.text}"</p>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Тарифні плани */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-primary">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Тарифні плани</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Виберіть план, який найкраще відповідає вашим потребам
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <Card 
                key={i} 
                className={`p-6 border-gray-800 relative ${plan.popular ? 'border-purple-500 shadow-lg shadow-purple-900/20' : ''}`}
              >
                {plan.popular && (
                  <Badge className="absolute top-0 right-6 transform -translate-y-1/2 bg-purple-600 text-white">
                    Популярний
                  </Badge>
                )}
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground ml-1">{plan.period}</span>
                </div>
                <p className="text-muted-foreground mb-6">{plan.description}</p>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <svg className="h-5 w-5 text-green-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full ${plan.popular ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
                  variant={plan.popular ? 'default' : 'outline'}
                  onClick={() => window.location.href = "/subscriptions"}
                >
                  Вибрати план
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA секція */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Готові створити своє унікальне татуювання?</h2>
          <p className="text-muted-foreground mb-8">
            Почніть своє творче подорож з штучним інтелектом вже сьогодні і створіть дизайн, що ідеально підходить вам
          </p>
          <Button 
            size="lg" 
            className="bg-purple-600 hover:bg-purple-700 text-lg"
            onClick={() => window.location.href = "/generate"}
          >
            Спробувати безкоштовно <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <div className="mt-6 text-sm text-muted-foreground">
            Без прихованих платежів. Не потрібна кредитна картка.
          </div>
        </div>
      </section>
      
      {/* FAQ секція */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-primary">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Часті запитання</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Відповіді на найпопулярніші запитання про Sin&Skin
            </p>
          </div>
          
          <div className="space-y-6">
            <Card className="p-6 border-gray-800">
              <h3 className="text-xl font-semibold mb-2">Як працює генерація татуювань AI?</h3>
              <p className="text-muted-foreground">
                Наша технологія використовує найсучасніші алгоритми машинного навчання, які були навчені на мільйонах зображень татуювань. Ви описуєте, що хочете, і штучний інтелект створює унікальний дизайн на основі вашого опису.
              </p>
            </Card>
            
            <Card className="p-6 border-gray-800">
              <h3 className="text-xl font-semibold mb-2">Чи можу я редагувати згенеровані дизайни?</h3>
              <p className="text-muted-foreground">
                Так, після генерації ви можете зберегти дизайн у вашу галерею та налаштувати деталі, додати опис, теги і поділитися з іншими.
              </p>
            </Card>
            
            <Card className="p-6 border-gray-800">
              <h3 className="text-xl font-semibold mb-2">Чи можу я використовувати згенеровані зображення для реального татуювання?</h3>
              <p className="text-muted-foreground">
                Звичайно! Всі згенеровані зображення можна використовувати як ескізи для реальних татуювань. Ви також можете поділитися ними з вашим тату-майстром через наш додаток.
              </p>
            </Card>
            
            <Card className="p-6 border-gray-800">
              <h3 className="text-xl font-semibold mb-2">Які існують обмеження на безкоштовному плані?</h3>
              <p className="text-muted-foreground">
                Безкоштовний план дозволяє створити обмежену кількість дизайнів з базовими стилями. Для доступу до всіх функцій та стилів рекомендуємо перейти на один з наших платних планів.
              </p>
            </Card>
          </div>
          
          <div className="text-center mt-8">
            <Link href="/subscriptions">
              <Button variant="link" className="text-purple-500">
                <BookOpen className="mr-2 h-4 w-4" /> Дізнатися більше в нашому довіднику
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Футер */}
      <section className="py-8 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Sin<span className="text-purple-500">&</span>Skin</h3>
              <p className="text-muted-foreground mb-4">
                Створюйте унікальні дизайни татуювань за допомогою штучного інтелекту.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-purple-500">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-purple-500">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-purple-500">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Посилання</h4>
              <ul className="space-y-2">
                <li><Link href="/generate" className="text-muted-foreground hover:text-purple-500">AI Generator</Link></li>
                <li><Link href="/gallery" className="text-muted-foreground hover:text-purple-500">Галерея</Link></li>
                <li><Link href="/subscriptions" className="text-muted-foreground hover:text-purple-500">Тарифи</Link></li>
                <li><Link href="/community" className="text-muted-foreground hover:text-purple-500">Спільнота</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Допомога</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-purple-500">FAQ</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-purple-500">Підтримка</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-purple-500">Політика конфіденційності</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-purple-500">Умови використання</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-800 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Sin&Skin. Усі права захищено.</p>
          </div>
        </div>
      </section>
    </div>
  );
}