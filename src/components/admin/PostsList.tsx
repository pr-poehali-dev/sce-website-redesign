import React, { useState } from 'react';
import { Edit, Trash, Calendar, Tag, User, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
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
import { storage } from '@/utils/storage';
import { Post } from '@/types';

interface PostsListProps {
  posts: Post[];
  refresh: () => void;
}

const PostsList: React.FC<PostsListProps> = ({ posts, refresh }) => {
  const { toast } = useToast();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Состояние для редактирования публикации
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editClearance, setEditClearance] = useState('');

  // Обработчики диалогов
  const openEditDialog = (post: Post) => {
    setSelectedPost(post);
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditCategory(post.category);
    setEditClearance(post.requiredClearance.toString());
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (post: Post) => {
    setSelectedPost(post);
    setIsDeleteDialogOpen(true);
  };

  const closeAllDialogs = () => {
    setIsEditDialogOpen(false);
    setIsDeleteDialogOpen(false);
    setSelectedPost(null);
  };

  // Обработчики действий
  const handleUpdatePost = () => {
    if (!selectedPost) return;

    try {
      const updatedPost: Post = {
        ...selectedPost,
        title: editTitle,
        content: editContent,
        category: editCategory as any,
        requiredClearance: parseInt(editClearance),
        updatedAt: new Date().toISOString()
      };

      storage.updatePost(updatedPost);
      
      toast({
        title: "Публикация обновлена",
        description: "Публикация успешно обновлена"
      });
      
      closeAllDialogs();
      refresh();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить публикацию",
        variant: "destructive"
      });
    }
  };

  const handleDeletePost = () => {
    if (!selectedPost) return;

    try {
      storage.deletePost(selectedPost.id);
      
      toast({
        title: "Публикация удалена",
        description: "Публикация успешно удалена"
      });
      
      closeAllDialogs();
      refresh();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить публикацию",
        variant: "destructive"
      });
    }
  };

  // Вспомогательные функции
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-4">
      {posts.length > 0 ? (
        posts.map(post => (
          <div key={post.id} className="border-b border-border pb-4 last:border-0">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium text-black dark:text-white">{post.title}</h3>
              </div>
              <div className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(post.category)}`}>
                <span className="flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  {getCategoryLabel(post.category)}
                </span>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground line-clamp-2">{post.content}</p>
            
            <div className="flex flex-wrap justify-between mt-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" /> 
                  {post.authorName}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> 
                  {formatDate(post.createdAt)}
                </span>
                <Badge variant="outline" className="text-xs">
                  Допуск: {post.requiredClearance}
                </Badge>
              </div>
              
              <div className="flex gap-2 mt-2 sm:mt-0">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2 text-muted-foreground hover:text-black dark:hover:text-white"
                  onClick={() => window.open(`/news/${post.id}`, '_blank')}
                >
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  Просмотр
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-7 px-2 text-muted-foreground hover:text-black dark:hover:text-white"
                  onClick={() => openEditDialog(post)}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Изменить
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-7 px-2 text-muted-foreground hover:text-red-500"
                  onClick={() => openDeleteDialog(post)}
                >
                  <Trash className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p>Публикации не найдены. Создайте новую публикацию.</p>
        </div>
      )}

      {/* Диалог редактирования */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-black dark:text-white">Редактирование публикации</DialogTitle>
            <DialogDescription>
              Внесите изменения в публикацию
            </DialogDescription>
          </DialogHeader>
          
          {selectedPost && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-black dark:text-white">
                  Заголовок
                </label>
                <Input 
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="text-black dark:text-white"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-black dark:text-white">
                  Тип публикации
                </label>
                <Select 
                  value={editCategory} 
                  onValueChange={setEditCategory}
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
              
              <div>
                <label className="text-sm font-medium text-black dark:text-white">
                  Уровень доступа
                </label>
                <Select 
                  value={editClearance} 
                  onValueChange={setEditClearance}
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
              
              <div>
                <label className="text-sm font-medium text-black dark:text-white">
                  Содержание
                </label>
                <Textarea 
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={6}
                  className="text-black dark:text-white"
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="text-black dark:text-white">
              Отмена
            </Button>
            <Button onClick={handleUpdatePost} className="text-white">
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Диалог подтверждения удаления */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-black dark:text-white">Подтверждение удаления</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить публикацию "{selectedPost?.title}"?
              Это действие невозможно отменить.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="text-black dark:text-white">
              Отмена
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeletePost}
              className="text-white"
            >
              <Trash className="h-4 w-4 mr-2" />
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PostsList;