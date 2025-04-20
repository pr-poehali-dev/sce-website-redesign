import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Newspaper, Calendar, Tag, User, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { storage } from '@/utils/storage';
import { Post } from '@/types';

const NewsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [currentCategory, setCurrentCategory] = useState<string>('all');

  useEffect(() => {
    // Загрузка публикаций
    const allPosts = storage.getPosts();
    const accessiblePosts = allPosts.filter(post => 
      !user || post.requiredClearance <= (user?.clearanceLevel || 0)
    );
    setPosts(accessiblePosts);
    setFilteredPosts(accessiblePosts);
  }, [user]);

  const filterPostsByCategory = (category: string) => {
    setCurrentCategory(category);
    if (category === 'all') {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(posts.filter(post => post.category === category));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'news': return 'Новость';
      case 'research': return 'Исследование';
      case 'report': return 'Отчет';
      case 'announcement': return 'Объявление';
      default: return category;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'news': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'research': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'report': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      case 'announcement': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="flex items-center gap-3 mb-6">
          <Newspaper className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold text-black dark:text-white">Новости и публикации</h1>
        </div>

        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="mb-6">
            <TabsTrigger value="all" onClick={() => filterPostsByCategory('all')}>
              Все публикации
            </TabsTrigger>
            <TabsTrigger value="news" onClick={() => filterPostsByCategory('news')}>
              Новости
            </TabsTrigger>
            <TabsTrigger value="announcement" onClick={() => filterPostsByCategory('announcement')}>
              Объявления
            </TabsTrigger>
            <TabsTrigger value="research" onClick={() => filterPostsByCategory('research')}>
              Исследования
            </TabsTrigger>
            <TabsTrigger value="report" onClick={() => filterPostsByCategory('report')}>
              Отчеты
            </TabsTrigger>
          </TabsList>

          <TabsContent value={currentCategory} className="mt-6">
            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {filteredPosts.map((post) => (
                  <Card key={post.id} className="overflow-hidden">
                    <CardHeader className="bg-card">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-black dark:text-white">{post.title}</CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            <User className="h-3 w-3" /> {post.authorName}
                            <span className="mx-1">•</span>
                            <Calendar className="h-3 w-3" /> {formatDate(post.createdAt)}
                          </CardDescription>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                          <span className="flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            {getCategoryLabel(post.category)}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="prose prose-sm dark:prose-invert">
                        <p className="text-black dark:text-gray-200">{post.content}</p>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-muted/50 flex justify-between">
                      <div className="text-xs text-muted-foreground">
                        Уровень допуска: {post.requiredClearance}
                      </div>
                      {post.category === 'research' && (
                        <Button variant="outline" size="sm" className="text-black dark:text-white">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Полное исследование
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Newspaper className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-medium text-black dark:text-white mb-2">Публикации не найдены</h3>
                <p className="text-muted-foreground">
                  {currentCategory === 'all' 
                    ? 'В данный момент нет доступных публикаций.' 
                    : `Нет публикаций в категории "${getCategoryLabel(currentCategory)}".`}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {user && (user.role === 'admin' || user.role === 'moderator') && (
          <div className="mt-8">
            <Separator className="mb-6" />
            <div className="flex justify-end">
              <Button onClick={() => navigate('/admin')}>
                <Newspaper className="h-4 w-4 mr-2" />
                Управление публикациями
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default NewsPage;