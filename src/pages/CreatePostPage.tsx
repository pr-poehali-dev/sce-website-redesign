import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FilePlus, Calendar, Info } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { storage } from '@/utils/storage';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

// Схема валидации формы
const formSchema = z.object({
  title: z.string().min(5, { message: 'Заголовок должен содержать не менее 5 символов' }),
  category: z.enum(['news', 'research', 'report', 'announcement'], {
    required_error: 'Выберите тип публикации',
  }),
  content: z.string().min(20, { message: 'Содержание должно быть более подробным (минимум 20 символов)' }),
  requiredClearance: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

const CreatePostPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      category: 'news',
      content: '',
      requiredClearance: '1',
    },
  });

  useEffect(() => {
    // Проверка прав доступа
    if (!user || (user.role !== 'admin' && user.role !== 'moderator' && user.role !== 'researcher')) {
      toast({
        title: "Доступ запрещен",
        description: "У вас нет прав для создания публикаций",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [user, navigate, toast]);

  // Оптимизация производительности за счет мемоизации
  const getCategoryLabel = React.useCallback((category: string) => {
    switch (category) {
      case 'news': return 'Новость';
      case 'research': return 'Исследование';
      case 'report': return 'Отчет';
      case 'announcement': return 'Объявление';
      default: return category;
    }
  }, []);

  const onSubmit = async (values: FormValues) => {
    if (!user) return;

    setIsSubmitting(true);

    try {
      // Имитация сетевой задержки для лучшего UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newPost = storage.createPost({
        title: values.title,
        content: values.content,
        category: values.category,
        authorId: user.id,
        authorName: user.username,
        requiredClearance: parseInt(values.requiredClearance),
      });

      toast({
        title: "Публикация создана",
        description: `Публикация "${values.title}" успешно создана и опубликована`,
      });

      // Перенаправляем на страницу новостей
      navigate('/news');
    } catch (error) {
      console.error('Ошибка при создании публикации:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось создать публикацию. Пожалуйста, попробуйте еще раз",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-6">
          <FilePlus className="h-6 w-6 text-accent" />
          <h1 className="text-2xl font-bold text-black dark:text-white">Создание публикации</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-black dark:text-white">Основная информация</CardTitle>
                    <CardDescription>Заполните основные данные публикации</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black dark:text-white">Заголовок</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Введите заголовок публикации" 
                              {...field} 
                              className="text-black dark:text-white"
                            />
                          </FormControl>
                          <FormDescription>
                            Заголовок будет отображаться в списке публикаций
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-black dark:text-white">Тип публикации</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="text-black dark:text-white">
                                  <SelectValue placeholder="Выберите тип публикации" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="news">Новость</SelectItem>
                                <SelectItem value="research">Исследование</SelectItem>
                                <SelectItem value="report">Отчет</SelectItem>
                                <SelectItem value="announcement">Объявление</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Тип публикации влияет на её оформление
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="requiredClearance"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-black dark:text-white">Уровень доступа</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="text-black dark:text-white">
                                  <SelectValue placeholder="Выберите уровень доступа" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="1">Уровень 1 (Общий доступ)</SelectItem>
                                <SelectItem value="2">Уровень 2</SelectItem>
                                <SelectItem value="3">Уровень 3</SelectItem>
                                <SelectItem value="4">Уровень 4</SelectItem>
                                <SelectItem value="5">Уровень 5 (Высший доступ)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Какой уровень допуска требуется для просмотра
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-black dark:text-white">Содержание публикации</CardTitle>
                    <CardDescription>Подробное содержание публикации</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black dark:text-white">Текст публикации</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Введите текст публикации..." 
                              className="min-h-[200px] text-black dark:text-white"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Полный текст публикации
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => navigate(-1)}
                      className="text-black dark:text-white"
                    >
                      Отмена
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="text-white"
                    >
                      {isSubmitting ? 'Публикация...' : 'Опубликовать'}
                    </Button>
                  </CardFooter>
                </Card>
              </form>
            </Form>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-black dark:text-white">
                  <Info className="h-5 w-5 inline-block mr-2" />
                  Информация
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium text-black dark:text-white mb-1">Автор публикации</h3>
                  <p className="text-sm text-muted-foreground">{user?.username}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-black dark:text-white mb-1">Дата публикации</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date().toLocaleDateString('ru-RU')}
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium text-black dark:text-white mb-1">Предпросмотр</h3>
                  <div className="bg-muted/50 rounded-md p-3">
                    <div className="font-medium text-black dark:text-white">
                      {form.watch('title') || 'Заголовок публикации'}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 mb-2">
                      {getCategoryLabel(form.watch('category'))} • Уровень доступа: {form.watch('requiredClearance')}
                    </div>
                    <p className="text-sm text-black dark:text-white line-clamp-3">
                      {form.watch('content') || 'Содержание публикации будет отображаться здесь...'}
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="text-sm text-muted-foreground">
                  <p>Публикация будет доступна пользователям с уровнем допуска не ниже {form.watch('requiredClearance')}.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreatePostPage;