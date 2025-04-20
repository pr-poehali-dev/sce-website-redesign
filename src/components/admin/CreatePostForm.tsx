import React, { useState } from 'react';
import { FilePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { storage } from '@/utils/storage';
import { useAuth } from '@/contexts/AuthContext';

const CreatePostForm: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [formState, setFormState] = useState({
    title: '',
    content: '',
    category: 'news',
    clearanceLevel: '1',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Ошибка",
        description: "Вы должны быть авторизованы для создания публикации",
        variant: "destructive"
      });
      return;
    }

    if (!formState.title || !formState.content) {
      toast({
        title: "Проверьте данные",
        description: "Заголовок и текст публикации обязательны для заполнения",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Имитация задержки для демонстрации состояния загрузки
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newPost = storage.createPost({
        title: formState.title,
        content: formState.content,
        category: formState.category as any,
        authorId: user.id,
        authorName: user.username,
        requiredClearance: parseInt(formState.clearanceLevel),
      });

      toast({
        title: "Публикация создана",
        description: "Ваша публикация успешно добавлена"
      });

      // Сбросим форму после успешного создания
      setFormState({
        title: '',
        content: '',
        category: 'news',
        clearanceLevel: '1',
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось создать публикацию. Попробуйте еще раз.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="title" className="text-black dark:text-white">Заголовок</Label>
        <Input
          id="title"
          name="title"
          value={formState.title}
          onChange={handleInputChange}
          placeholder="Введите заголовок публикации"
          className="text-black dark:text-white"
          required
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="category" className="text-black dark:text-white">Тип публикации</Label>
        <Select 
          value={formState.category} 
          onValueChange={(value) => handleSelectChange('category', value)}
        >
          <SelectTrigger className="text-black dark:text-white">
            <SelectValue placeholder="Выберите тип публикации" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="news">Новость</SelectItem>
            <SelectItem value="research">Исследование</SelectItem>
            <SelectItem value="report">Отчет</SelectItem>
            <SelectItem value="announcement">Объявление</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="clearanceLevel" className="text-black dark:text-white">Уровень доступа</Label>
        <Select 
          value={formState.clearanceLevel} 
          onValueChange={(value) => handleSelectChange('clearanceLevel', value)}
        >
          <SelectTrigger className="text-black dark:text-white">
            <SelectValue placeholder="Выберите уровень доступа" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Уровень 1 (Общий доступ)</SelectItem>
            <SelectItem value="2">Уровень 2</SelectItem>
            <SelectItem value="3">Уровень 3</SelectItem>
            <SelectItem value="4">Уровень 4</SelectItem>
            <SelectItem value="5">Уровень 5 (Высший доступ)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="content" className="text-black dark:text-white">Содержание</Label>
        <Textarea
          id="content"
          name="content"
          value={formState.content}
          onChange={handleInputChange}
          placeholder="Введите текст публикации"
          rows={6}
          className="text-black dark:text-white"
          required
        />
      </div>
      
      <Button type="submit" className="w-full text-white" disabled={isSubmitting}>
        <FilePlus className="h-4 w-4 mr-2" />
        {isSubmitting ? 'Публикация...' : 'Опубликовать'}
      </Button>
    </form>
  );
};

export default CreatePostForm;