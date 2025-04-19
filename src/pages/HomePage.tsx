import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, FileText, AlertCircle, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { storage } from '@/utils/storage';
import { SCEObject, Post } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const HomePage: React.FC = () => {
  const { user, hasPermission } = useAuth();
  const [latestObjects, setLatestObjects] = useState<SCEObject[]>([]);
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);

  useEffect(() => {
    // Загружаем последние объекты SCE и новости
    const objects = storage.getSCEObjects()
      .filter(obj => !user ? obj.requiredClearance <= 1 : obj.requiredClearance <= (user?.clearanceLevel || 0))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);
    
    const posts = storage.getPosts()
      .filter(post => !user ? post.requiredClearance <= 1 : post.requiredClearance <= (user?.clearanceLevel || 0))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);
    
    setLatestObjects(objects);
    setLatestPosts(posts);
  }, [user]);

  const objectClassColor = (objectClass: string) => {
    switch (objectClass.toLowerCase()) {
      case 'безопасный': return 'bg-green-500';
      case 'евклид': return 'bg-yellow-500';
      case 'кетер': return 'bg-red-500';
      case 'таумиэль': return 'bg-purple-500';
      case 'нейтрализованный': return 'bg-gray-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <Layout>
      {/* Герой-секция */}
      <section className="py-16 mb-8 border-b border-border">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <ShieldAlert className="h-16 w-16 text-accent" />
          </div>
          <h1 className="text-4xl font-bold mb-4">SCE Foundation</h1>
          <p className="text-xl mb-6">Secure. Control. Explore.</p>
          <p className="text-muted-foreground mb-8">
            Фонд SCE - организация, занимающаяся задержанием аномалий, 
            их исследованием и контролем для защиты человечества.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link to="/objects">Объекты SCE</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/about">О Фонде</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Предупреждение о безопасности */}
      <section className="mb-12">
        <div className="sce-warning">
          <div className="flex items-start gap-4">
            <AlertCircle className="h-6 w-6 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold mb-2">ПРЕДУПРЕЖДЕНИЕ БЕЗОПАСНОСТИ</h3>
              <p>
                Все материалы на этом сайте подлежат строгой классификации. Несанкционированный доступ
                или разглашение информации строго запрещены. Нарушители будут подвергнуты дисциплинарным мерам.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Последние объекты SCE */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Последние объекты SCE</h2>
          <Button asChild variant="outline" size="sm">
            <Link to="/objects">Все объекты</Link>
          </Button>
        </div>

        {latestObjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestObjects.map((object) => (
              <Card key={object.id} className="sce-object">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div className="text-lg font-bold">{object.code}</div>
                    <div className={`${objectClassColor(object.objectClass)} text-white px-2 py-1 rounded-sm text-xs`}>
                      {object.objectClass}
                    </div>
                  </div>
                  <CardTitle>{object.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3">{object.description.substring(0, 150)}...</p>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link to={`/objects/${object.id}`} className="flex items-center justify-center gap-2">
                      <Eye className="h-4 w-4" />
                      <span>Подробнее</span>
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="sce-object text-center py-8">
            <p className="text-muted-foreground">Объекты SCE не найдены или у вас недостаточно прав доступа.</p>
          </div>
        )}
      </section>

      {/* Последние публикации */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Последние публикации</h2>
          <Button asChild variant="outline" size="sm">
            <Link to="/reports">Все публикации</Link>
          </Button>
        </div>

        {latestPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestPosts.map((post) => (
              <Card key={post.id} className="sce-object">
                <CardHeader>
                  <div className="text-sm text-muted-foreground mb-1">
                    {new Date(post.createdAt).toLocaleDateString()}
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
                      <FileText className="h-4 w-4" />
                      <span>Читать</span>
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="sce-object text-center py-8">
            <p className="text-muted-foreground">Публикации не найдены или у вас недостаточно прав доступа.</p>
          </div>
        )}
      </section>

      {/* Присоединяйтесь к нам */}
      {!user && (
        <section className="mb-12">
          <div className="sce-object bg-secondary/50">
            <div className="text-center py-8 px-4">
              <h2 className="text-2xl font-bold mb-4">Присоединяйтесь к Фонду SCE</h2>
              <p className="mb-6 max-w-2xl mx-auto">
                Зарегистрируйтесь сейчас, чтобы получить доступ к архивам Фонда SCE и стать частью сообщества, 
                защищающего человечество от аномальных явлений.
              </p>
              <Button asChild size="lg">
                <Link to="/register">Зарегистрироваться</Link>
              </Button>
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default HomePage;
