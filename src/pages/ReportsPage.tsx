import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Filter, Search, Plus, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { storage } from '@/utils/storage';
import { Post } from '@/types';

const ReportsPage: React.FC = () => {
  const { user, isAdmin, hasPermission } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    // Загружаем отчеты и публикации
    const allPosts = storage.getPosts()
      .filter(post => hasPermission(post.requiredClearance))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    setPosts(allPosts);
    setFilteredPosts(allPosts);
  }, [user, hasPermission]);

  useEffect(() => {
    // Применяем фильтры при изменении поискового запроса или категории
    let filtered = posts;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(query) || 
        post.content.toLowerCase().includes(query) ||
        post.authorName.toLowerCase().includes(query)
      );
    }
    
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(post => post.category === categoryFilter);
    }
    
    setFilteredPosts(filtered);
  }, [posts, searchQuery, categoryFilter]);

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'news': return 'Новости';
      case 'research': return 'Исследование';
      case 'report': return 'Отчет';
      case 'announcement': return 'Объявление';
      default: return category;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'news': return 'bg-blue-500';
      case 'research': return 'bg-purple-500';
      case 'report': return 'bg-green-500';
      case 'announcement': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold">Отчеты и публикации</h1>
          {isAdmin && (
            <Button asChild>
              <Link to="/create-post" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span>Создать публикацию</span>
              </Link>
            </Button>
          )}
        </div>

        <div className="sce-object bg-card mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Поиск публикаций..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="lg:w-64">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Фильтр по категории" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все категории</SelectItem>
                  <SelectItem value="news">Новости</SelectItem>
                  <SelectItem value="research">Исследования</SelectItem>
                  <SelectItem value="report">Отчеты</SelectItem>
                  <SelectItem value="announcement">Объявления</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="sce-object">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="text-sm text-muted-foreground">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                    <div className={`${getCategoryColor(post.category)} text-white px-2 py-1 rounded-sm text-xs`}>
                      {getCategoryLabel(post.category)}
                    </div>
                  </div>
                  <CardTitle>{post.title}</CardTitle>
                  <CardDescription>Автор: {post.authorName}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3">{post.content.substring(0, 150)}...</p>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link to={`/posts/${post.id}`} className="flex items-center justify-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      <span>Читать</span>
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="sce-object text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-2">Публикации не найдены.</p>
            <p className="text-sm text-muted-foreground">
              {user ? 
                'Попробуйте изменить параметры поиска или создайте новую публикацию.' : 
                'Пожалуйста, войдите в систему, чтобы получить доступ к полному архиву отчетов.'}
            </p>
            {isAdmin && (
              <Button asChild className="mt-4">
                <Link to="/create-post">
                  <Plus className="h-4 w-4 mr-2" />
                  <span>Создать публикацию</span>
                </Link>
              </Button>
            )}
          </div>
        )}

        {/* Для демонстрации добавим несколько отчетов, если их нет */}
        {filteredPosts.length === 0 && user && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Примеры публикаций</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="sce-object">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="text-sm text-muted-foreground">
                      {new Date().toLocaleDateString()}
                    </div>
                    <div className="bg-blue-500 text-white px-2 py-1 rounded-sm text-xs">
                      Новости
                    </div>
                  </div>
                  <CardTitle>Обновление системы безопасности</CardTitle>
                  <CardDescription>Автор: Администрация SCE</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Фонд SCE сообщает об обновлении системы безопасности на всех объектах класса Евклид. Все сотрудники должны ознакомиться с новыми протоколами...</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    <BookOpen className="h-4 w-4 mr-2" />
                    <span>Читать (пример)</span>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="sce-object">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="text-sm text-muted-foreground">
                      {new Date().toLocaleDateString()}
                    </div>
                    <div className="bg-purple-500 text-white px-2 py-1 rounded-sm text-xs">
                      Исследование
                    </div>
                  </div>
                  <CardTitle>Анализ аномальных свойств SCE-042</CardTitle>
                  <CardDescription>Автор: Д-р Александров</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Результаты последних экспериментов с объектом SCE-042 показывают неожиданные аномальные свойства при взаимодействии с органическими материалами...</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    <BookOpen className="h-4 w-4 mr-2" />
                    <span>Читать (пример)</span>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="sce-object">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="text-sm text-muted-foreground">
                      {new Date().toLocaleDateString()}
                    </div>
                    <div className="bg-green-500 text-white px-2 py-1 rounded-sm text-xs">
                      Отчет
                    </div>
                  </div>
                  <CardTitle>Ежемесячный отчет о содержании</CardTitle>
                  <CardDescription>Автор: Служба безопасности</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Отчет о состоянии систем сдерживания за октябрь 2023. Зафиксировано 3 инцидента нарушения условий содержания. Все системы восстановлены в штатном режиме...</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    <BookOpen className="h-4 w-4 mr-2" />
                    <span>Читать (пример)</span>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ReportsPage;
