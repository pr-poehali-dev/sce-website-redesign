import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FilePlus, Filter, Eye, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
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
import { SCEObject } from '@/types';

const ObjectsPage: React.FC = () => {
  const { user, isAdmin, hasPermission } = useAuth();
  const [objects, setObjects] = useState<SCEObject[]>([]);
  const [filteredObjects, setFilteredObjects] = useState<SCEObject[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('all');

  useEffect(() => {
    // Загружаем объекты SCE
    const allObjects = storage.getSCEObjects()
      .filter(obj => hasPermission(obj.requiredClearance))
      .sort((a, b) => a.code.localeCompare(b.code));
    
    setObjects(allObjects);
    setFilteredObjects(allObjects);
  }, [user, hasPermission]);

  useEffect(() => {
    // Применяем фильтры при изменении поискового запроса или класса объекта
    let filtered = objects;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(obj => 
        obj.code.toLowerCase().includes(query) || 
        obj.name.toLowerCase().includes(query) ||
        obj.description.toLowerCase().includes(query)
      );
    }
    
    if (classFilter !== 'all') {
      filtered = filtered.filter(obj => obj.objectClass.toLowerCase() === classFilter.toLowerCase());
    }
    
    setFilteredObjects(filtered);
  }, [objects, searchQuery, classFilter]);

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
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold">Объекты SCE</h1>
          {isAdmin && (
            <Button asChild>
              <Link to="/create-object" className="flex items-center gap-2">
                <FilePlus className="h-4 w-4" />
                <span>Создать новый объект</span>
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
                  placeholder="Поиск объектов SCE..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="lg:w-64">
              <Select value={classFilter} onValueChange={setClassFilter}>
                <SelectTrigger className="w-full">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Фильтр по классу" />
                  </div>
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
        </div>

        {filteredObjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredObjects.map((object) => (
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
          <div className="sce-object text-center py-12">
            <p className="text-muted-foreground mb-2">Объекты SCE не найдены.</p>
            <p className="text-sm text-muted-foreground">
              {user ? 
                'Попробуйте изменить параметры поиска или создайте новый объект.' : 
                'Пожалуйста, войдите в систему, чтобы получить доступ к полному каталогу объектов SCE.'}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ObjectsPage;
