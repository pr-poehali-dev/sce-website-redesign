import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash, Eye, Info, Search, Filter } from 'lucide-react';
import { 
  Card, 
  CardContent,
  CardFooter
} from '@/components/ui/card';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { storage } from '@/utils/storage';
import { SCEObject } from '@/types';
import { useToast } from '@/components/ui/use-toast';

interface ObjectManagerProps {
  objects: SCEObject[];
}

const ObjectManager: React.FC<ObjectManagerProps> = ({ objects }) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState<string>('all');
  const [selectedObject, setSelectedObject] = useState<SCEObject | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  
  // Состояние для редактирования объекта
  const [editCode, setEditCode] = useState('');
  const [editName, setEditName] = useState('');
  const [editClass, setEditClass] = useState('');
  const [editProcedures, setEditProcedures] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editClearance, setEditClearance] = useState('');

  // Фильтрация и поиск объектов
  const filteredObjects = objects.filter(obj => {
    const matchesSearch = obj.code.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          obj.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = filterClass === 'all' || obj.objectClass === filterClass;
    return matchesSearch && matchesClass;
  });

  // Обработчики диалогов
  const openEditDialog = (obj: SCEObject) => {
    setSelectedObject(obj);
    setEditCode(obj.code);
    setEditName(obj.name);
    setEditClass(obj.objectClass);
    setEditProcedures(obj.containmentProcedures);
    setEditDescription(obj.description);
    setEditClearance(obj.requiredClearance.toString());
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (obj: SCEObject) => {
    setSelectedObject(obj);
    setIsDeleteDialogOpen(true);
  };

  const openViewDialog = (obj: SCEObject) => {
    setSelectedObject(obj);
    setIsViewDialogOpen(true);
  };

  const closeAllDialogs = () => {
    setIsEditDialogOpen(false);
    setIsDeleteDialogOpen(false);
    setIsViewDialogOpen(false);
    setSelectedObject(null);
  };

  // Обработчики действий
  const handleUpdateObject = () => {
    if (!selectedObject) return;

    try {
      const updatedObject: SCEObject = {
        ...selectedObject,
        code: editCode,
        name: editName,
        objectClass: editClass as any,
        containmentProcedures: editProcedures,
        description: editDescription,
        requiredClearance: parseInt(editClearance),
        updatedAt: new Date().toISOString()
      };

      storage.updateSCEObject(updatedObject);
      
      toast({
        title: "Объект обновлен",
        description: `Объект ${updatedObject.code} успешно обновлен`,
      });
      
      closeAllDialogs();
      // Обновляем страницу для отображения изменений
      setTimeout(() => window.location.reload(), 500);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить объект",
        variant: "destructive",
      });
    }
  };

  const handleDeleteObject = () => {
    if (!selectedObject) return;

    try {
      storage.deleteSCEObject(selectedObject.id);
      
      toast({
        title: "Объект удален",
        description: `Объект ${selectedObject.code} успешно удален`,
      });
      
      closeAllDialogs();
      // Обновляем страницу для отображения изменений
      setTimeout(() => window.location.reload(), 500);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить объект",
        variant: "destructive",
      });
    }
  };

  // Вспомогательные функции
  const getObjectClassBadge = (objectClass: string) => {
    switch (objectClass) {
      case 'безопасный': return <Badge className="bg-green-500">Безопасный</Badge>;
      case 'евклид': return <Badge className="bg-yellow-500">Евклид</Badge>;
      case 'кетер': return <Badge className="bg-red-500">Кетер</Badge>;
      case 'таумиэль': return <Badge className="bg-purple-500">Таумиэль</Badge>;
      case 'нейтрализованный': return <Badge className="bg-gray-500">Нейтрализованный</Badge>;
      default: return <Badge>Неизвестно</Badge>;
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-8 text-black dark:text-white"
            placeholder="Поиск по коду или названию..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select
            value={filterClass}
            onValueChange={setFilterClass}
          >
            <SelectTrigger className="w-[180px] text-black dark:text-white">
              <SelectValue placeholder="Класс объекта" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все классы</SelectItem>
              <SelectItem value="безопасный">Безопасный</SelectItem>
              <SelectItem value="евклид">Евклид</SelectItem>
              <SelectItem value="кетер">Кетер</SelectItem>
              <SelectItem value="таумиэль">Таумиэль</SelectItem>
              <SelectItem value="нейтрализованный">Нейтрализованный</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredObjects.length > 0 ? (
        <div className="space-y-4">
          {filteredObjects.map((obj) => (
            <Card key={obj.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm bg-black/10 dark:bg-white/10 px-2 py-0.5 rounded text-black dark:text-white">{obj.code}</span>
                      {getObjectClassBadge(obj.objectClass)}
                      <Badge variant="outline" className="text-black dark:text-white">
                        Уровень: {obj.requiredClearance}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-bold text-black dark:text-white">{obj.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{obj.description}</p>
                  </div>
                  
                  <div className="flex items-start gap-2 mt-4 md:mt-0">
                    <Button size="sm" variant="outline" onClick={() => openViewDialog(obj)} className="text-black dark:text-white">
                      <Eye className="h-4 w-4 mr-1" />
                      Просмотр
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => openEditDialog(obj)} className="text-black dark:text-white">
                      <Edit className="h-4 w-4 mr-1" />
                      Изменить
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => openDeleteDialog(obj)} className="text-red-500">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/50 flex justify-between py-2 px-4">
                <span className="text-xs text-muted-foreground">
                  Создан: {new Date(obj.createdAt).toLocaleDateString()}
                </span>
                <span className="text-xs text-muted-foreground">
                  Обновлен: {new Date(obj.updatedAt).toLocaleDateString()}
                </span>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Info className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-medium text-black dark:text-white mb-2">Объекты не найдены</h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery || filterClass !== 'all' 
              ? 'Попробуйте изменить параметры поиска или фильтрации' 
              : 'В базе данных нет зарегистрированных объектов SCE'}
          </p>
          <Button asChild>
            <Link to="/create-object">Создать новый объект</Link>
          </Button>
        </div>
      )}

      {/* Диалог просмотра */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-black dark:text-white">
              <span className="font-mono">{selectedObject?.code}</span>
              {selectedObject && getObjectClassBadge(selectedObject.objectClass)}
            </DialogTitle>
            <DialogDescription>
              Полная информация об объекте
            </DialogDescription>
          </DialogHeader>
          
          {selectedObject && (
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-4 p-1">
                <div>
                  <h2 className="text-2xl font-bold text-black dark:text-white mb-2">{selectedObject.name}</h2>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline" className="text-black dark:text-white">
                      Класс: {selectedObject.objectClass}
                    </Badge>
                    <Badge variant="outline" className="text-black dark:text-white">
                      Уровень допуска: {selectedObject.requiredClearance}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-black dark:text-white mb-2">Процедуры содержания</h3>
                  <div className="bg-muted p-3 rounded text-black dark:text-white whitespace-pre-line">
                    {selectedObject.containmentProcedures}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-semibold text-black dark:text-white mb-2">Описание</h3>
                  <div className="bg-muted p-3 rounded text-black dark:text-white whitespace-pre-line">
                    {selectedObject.description}
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between text-sm text-muted-foreground">
                  <div>Создан: {new Date(selectedObject.createdAt).toLocaleString()}</div>
                  <div>Последнее обновление: {new Date(selectedObject.updatedAt).toLocaleString()}</div>
                </div>
              </div>
            </ScrollArea>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)} className="text-black dark:text-white">
              Закрыть
            </Button>
            <Button variant="outline" onClick={() => {
              setIsViewDialogOpen(false);
              openEditDialog(selectedObject!);
            }} className="text-black dark:text-white">
              <Edit className="h-4 w-4 mr-2" />
              Редактировать
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Диалог редактирования */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-black dark:text-white">Редактирование объекта</DialogTitle>
            <DialogDescription>
              Измените информацию об объекте SCE
            </DialogDescription>
          </DialogHeader>
          
          {selectedObject && (
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-4 p-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-black dark:text-white">
                      Код объекта
                    </label>
                    <Input 
                      value={editCode}
                      onChange={(e) => setEditCode(e.target.value)}
                      className="text-black dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-black dark:text-white">
                      Класс объекта
                    </label>
                    <Select 
                      value={editClass} 
                      onValueChange={setEditClass}
                    >
                      <SelectTrigger className="text-black dark:text-white">
                        <SelectValue placeholder="Выберите класс объекта" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="безопасный">Безопасный</SelectItem>
                        <SelectItem value="евклид">Евклид</SelectItem>
                        <SelectItem value="кетер">Кетер</SelectItem>
                        <SelectItem value="таумиэль">Таумиэль</SelectItem>
                        <SelectItem value="нейтрализованный">Нейтрализованный</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-black dark:text-white">
                    Название объекта
                  </label>
                  <Input 
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="text-black dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-black dark:text-white">
                    Требуемый уровень доступа
                  </label>
                  <Select 
                    value={editClearance} 
                    onValueChange={setEditClearance}
                  >
                    <SelectTrigger className="text-black dark:text-white">
                      <SelectValue placeholder="Выберите уровень доступа" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Уровень 1</SelectItem>
                      <SelectItem value="2">Уровень 2</SelectItem>
                      <SelectItem value="3">Уровень 3</SelectItem>
                      <SelectItem value="4">Уровень 4</SelectItem>
                      <SelectItem value="5">Уровень 5 (максимальный)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-black dark:text-white">
                    Процедуры содержания
                  </label>
                  <Textarea 
                    value={editProcedures}
                    onChange={(e) => setEditProcedures(e.target.value)}
                    rows={5}
                    className="text-black dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-black dark:text-white">
                    Описание
                  </label>
                  <Textarea 
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    rows={8}
                    className="text-black dark:text-white"
                  />
                </div>
              </div>
            </ScrollArea>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="text-black dark:text-white">
              Отмена
            </Button>
            <Button onClick={handleUpdateObject} className="text-white">
              Сохранить изменения
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
              Вы уверены, что хотите удалить объект {selectedObject?.code}?
              Это действие невозможно отменить.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="text-black dark:text-white">
              Отмена
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteObject}
              className="text-white"
            >
              <Trash className="h-4 w-4 mr-2" />
              Удалить объект
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ObjectManager;