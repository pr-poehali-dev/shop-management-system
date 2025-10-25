import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
};

type CartItem = Product & { quantity: number };

const products: Product[] = [
  {
    id: 1,
    name: 'Год',
    price: 189000,
    category: 'Аксессуары',
    image: 'https://cdn.poehali.dev/projects/cff2dda3-ce92-46c8-8602-ec29f554e8da/files/b4b3cf1a-4957-4ef2-86ff-bf3d9fad90a1.jpg',
    description: 'Роскошные швейцарские часы с автоматическим механизмом'
  },
  {
    id: 2,
    name: 'Год',
    price: 145000,
    category: 'Сумки',
    image: 'https://cdn.poehali.dev/projects/cff2dda3-ce92-46c8-8602-ec29f554e8da/files/f5324908-6452-4b79-b605-c03f37f6de4e.jpg',
    description: 'Элегантная сумка из натуральной итальянской кожи'
  },
  {
    id: 3,
    name: 'Год',
    price: 32000,
    category: 'Парфюмерия',
    image: 'https://cdn.poehali.dev/projects/cff2dda3-ce92-46c8-8602-ec29f554e8da/files/1c15699f-2df7-4f01-bee7-87d4b5f75707.jpg',
    description: 'Премиальный аромат с нотами амбры и ванили'
  },
];

export default function Index() {
  const [currentSection, setCurrentSection] = useState('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Все');

  const categories = ['Все', 'Аксессуары', 'Сумки', 'Парфюмерия'];

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.id === productId ? { ...item, quantity } : item))
    );
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const filteredProducts = selectedCategory === 'Все' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-serif font-bold text-primary">Миша и Артём</h1>
          
          <nav className="hidden md:flex items-center gap-8">
            {['home', 'catalog', 'about', 'delivery', 'contacts'].map((section) => (
              <button
                key={section}
                onClick={() => setCurrentSection(section)}
                className={`text-sm uppercase tracking-wider transition-colors hover:text-primary ${
                  currentSection === section ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {section === 'home' && 'Главная'}
                {section === 'catalog' && 'Каталог'}
                {section === 'about' && 'О бренде'}
                {section === 'delivery' && 'Доставка'}
                {section === 'contacts' && 'Контакты'}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Icon name="User" size={20} />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="font-serif text-2xl">
                    {isLoggedIn ? 'Личный кабинет' : 'Вход в аккаунт'}
                  </DialogTitle>
                </DialogHeader>
                {isLoggedIn ? (
                  <div className="space-y-4 py-4">
                    <p className="text-muted-foreground">Добро пожаловать в Миша и Артём</p>
                    <Button onClick={() => setIsLoggedIn(false)} variant="outline" className="w-full">
                      Выйти
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4 py-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="your@email.com" />
                    </div>
                    <div>
                      <Label htmlFor="password">Пароль</Label>
                      <Input id="password" type="password" placeholder="••••••••" />
                    </div>
                    <Button onClick={() => setIsLoggedIn(true)} className="w-full">
                      Войти
                    </Button>
                  </div>
                )}
              </DialogContent>
            </Dialog>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Icon name="ShoppingBag" size={20} />
                  {cartItemsCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {cartItemsCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-lg animate-slide-in-right">
                <SheetHeader>
                  <SheetTitle className="font-serif text-2xl">Корзина</SheetTitle>
                </SheetHeader>
                <div className="mt-8 space-y-4">
                  {cart.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">Корзина пуста</p>
                  ) : (
                    <>
                      {cart.map((item) => (
                        <div key={item.id} className="flex gap-4 animate-fade-in">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {item.price.toLocaleString('ru-RU')} ₽
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-6 w-6"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Icon name="Minus" size={12} />
                              </Button>
                              <span className="text-sm w-8 text-center">{item.quantity}</span>
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-6 w-6"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Icon name="Plus" size={12} />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6 ml-auto"
                                onClick={() => removeFromCart(item.id)}
                              >
                                <Icon name="Trash2" size={12} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                      <Separator className="my-4" />
                      <div className="space-y-2">
                        <div className="flex justify-between text-lg font-medium">
                          <span>Итого:</span>
                          <span className="text-primary">{totalPrice.toLocaleString('ru-RU')} ₽</span>
                        </div>
                        <Button className="w-full" size="lg">
                          Оформить заказ
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main>
        {currentSection === 'home' && (
          <div>
            <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background" />
              <div className="relative z-10 text-center space-y-6 animate-fade-in px-6">
                <h2 className="text-6xl md:text-8xl font-serif font-light tracking-wider">
                  Миша и Артём
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Эксклюзивная коллекция премиум-товаров для истинных ценителей качества
                </p>
                <Button 
                  size="lg" 
                  className="mt-8 px-12"
                  onClick={() => setCurrentSection('catalog')}
                >
                  Смотреть коллекцию
                </Button>
              </div>
            </section>

            <section className="container mx-auto px-6 py-20">
              <h3 className="text-4xl font-serif text-center mb-12">Избранное</h3>
              <div className="grid md:grid-cols-3 gap-8">
                {products.map((product, index) => (
                  <Card
                    key={product.id}
                    className="group overflow-hidden border-0 bg-card hover:shadow-2xl transition-all duration-300 animate-scale-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-6 space-y-4">
                      <div>
                        <Badge variant="secondary" className="mb-2">
                          {product.category}
                        </Badge>
                        <h4 className="text-xl font-serif">{product.name}</h4>
                        <p className="text-sm text-muted-foreground mt-2">
                          {product.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-medium text-primary">
                          {product.price.toLocaleString('ru-RU')} ₽
                        </span>
                        <Button onClick={() => addToCart(product)} size="sm">
                          <Icon name="Plus" size={16} className="mr-2" />
                          В корзину
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        )}

        {currentSection === 'catalog' && (
          <div className="container mx-auto px-6 py-12">
            <h2 className="text-5xl font-serif mb-8 animate-fade-in">Каталог</h2>
            
            <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category)}
                  className="whitespace-nowrap"
                >
                  {category}
                </Button>
              ))}
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {filteredProducts.map((product, index) => (
                <Card
                  key={product.id}
                  className="group overflow-hidden border-0 bg-card hover:shadow-2xl transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <Badge variant="secondary" className="mb-2">
                        {product.category}
                      </Badge>
                      <h4 className="text-xl font-serif">{product.name}</h4>
                      <p className="text-sm text-muted-foreground mt-2">
                        {product.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-medium text-primary">
                        {product.price.toLocaleString('ru-RU')} ₽
                      </span>
                      <Button onClick={() => addToCart(product)} size="sm">
                        <Icon name="Plus" size={16} className="mr-2" />
                        В корзину
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {currentSection === 'about' && (
          <div className="container mx-auto px-6 py-12 max-w-4xl">
            <h2 className="text-5xl font-serif mb-8 animate-fade-in">О бренде</h2>
            <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
              <p className="animate-fade-in" style={{ animationDelay: '100ms' }}>
                Миша и Артём — это воплощение роскоши и изысканного вкуса. Мы создали пространство, где каждая деталь имеет значение, а каждый товар рассказывает свою историю о мастерстве и совершенстве.
              </p>
              <p className="animate-fade-in" style={{ animationDelay: '200ms' }}>
                Наша коллекция включает тщательно отобранные премиум-товары от ведущих мировых брендов. Мы работаем только с проверенными производителями, которые разделяют нашу философию качества и внимания к деталям.
              </p>
              <p className="animate-fade-in" style={{ animationDelay: '300ms' }}>
                Для нас важен не просто продукт, а весь опыт взаимодействия с брендом — от первого знакомства до послепродажного обслуживания. Мы создаём атмосферу эксклюзивности и заботы о каждом клиенте.
              </p>
            </div>
          </div>
        )}

        {currentSection === 'delivery' && (
          <div className="container mx-auto px-6 py-12 max-w-4xl">
            <h2 className="text-5xl font-serif mb-8 animate-fade-in">Доставка</h2>
            <div className="space-y-8">
              <Card className="p-6 border-0 animate-fade-in" style={{ animationDelay: '100ms' }}>
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Icon name="Truck" size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif mb-2">Курьерская доставка</h3>
                    <p className="text-muted-foreground">
                      Доставка по Москве и области в течение 1-2 дней. Курьер свяжется с вами за час до приезда.
                    </p>
                    <p className="text-primary mt-2">Бесплатно при заказе от 50 000 ₽</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-0 animate-fade-in" style={{ animationDelay: '200ms' }}>
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Icon name="Package" size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif mb-2">Доставка по России</h3>
                    <p className="text-muted-foreground">
                      Отправка заказов в регионы через проверенные транспортные компании. Срок доставки 3-7 дней.
                    </p>
                    <p className="text-primary mt-2">От 1 500 ₽</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-0 animate-fade-in" style={{ animationDelay: '300ms' }}>
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Icon name="Shield" size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif mb-2">Гарантии</h3>
                    <p className="text-muted-foreground">
                      Все товары застрахованы и имеют сертификаты подлинности. Мы гарантируем оригинальность каждого изделия.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {currentSection === 'contacts' && (
          <div className="container mx-auto px-6 py-12 max-w-4xl">
            <h2 className="text-5xl font-serif mb-8 animate-fade-in">Контакты</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-6 border-0 animate-fade-in">
                <h3 className="text-xl font-serif mb-4">Свяжитесь с нами</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Icon name="Phone" size={20} className="text-primary" />
                    <span>+7 (495) 123-45-67</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Icon name="Mail" size={20} className="text-primary" />
                    <span>info@elite-shop.ru</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Icon name="MapPin" size={20} className="text-primary" />
                    <span>Москва, Тверская ул., 1</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-0 animate-fade-in" style={{ animationDelay: '100ms' }}>
                <h3 className="text-xl font-serif mb-4">Режим работы</h3>
                <div className="space-y-2 text-muted-foreground">
                  <p>Пн-Пт: 10:00 - 21:00</p>
                  <p>Сб-Вс: 11:00 - 20:00</p>
                  <p className="text-primary mt-4">Консультация по предварительной записи</p>
                </div>
              </Card>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-border mt-20">
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-serif mb-4 text-primary">Миша и Артём</h3>
              <p className="text-sm text-muted-foreground">
                Премиум-товары для ценителей качества и стиля
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-4">Навигация</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="hover:text-primary cursor-pointer transition-colors" onClick={() => setCurrentSection('catalog')}>Каталог</p>
                <p className="hover:text-primary cursor-pointer transition-colors" onClick={() => setCurrentSection('about')}>О бренде</p>
                <p className="hover:text-primary cursor-pointer transition-colors" onClick={() => setCurrentSection('delivery')}>Доставка</p>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-4">Контакты</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>+7 (495) 123-45-67</p>
                <p>info@elite-shop.ru</p>
              </div>
            </div>
          </div>
          <Separator />
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>© 2024 Миша и Артём. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}