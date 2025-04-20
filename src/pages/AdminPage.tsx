import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldAlert, Users, FileText, Database, Settings, Plus, Edit, Trash, 
  BarChart, CheckCircle, UserPlus, Newspaper, FilePlus, Eye, ArrowRight,
  RefreshCw, AlertTriangle, FileEdit
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { storage } from '@/utils/storage';
import { User, Position, UserRole, UserStatus, SCEObject, Post } from '@/types';

// Ленивая загрузка компонентов для улучшения производительности
const ObjectManager = lazy(() => import('@/components/admin/ObjectManager'));
const CreatePostForm = lazy(() => import('@/components/admin/CreatePostForm'));
const PostsList = lazy(() => import('@/components/admin/PostsList'));

// Компонент-заглушка для ленивой загрузки
const LazyLoadingPlaceholder = () => (
  <div className="space-y-4">
    <Skeleton className="h-12 w-full" />
    <Skeleton className="h-64 w-full" />
  </div>
);

const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [objects, setObjects] = useState<SCEObject[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedObject, setSelectedObject] = useState<SCEObject | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState("dashboard");
  
  // Состояние для создания должностей
  const [newPositionName, setNewPositionName] = useState('');
  const [newPositionDescription, setNewPositionDescription] = useState('');
  const [newPositionClearance, setNewPositionClearance] = useState('1');
  
  // Состояние для редактирования пользователей
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editRole, setEditRole] = useState<UserRole>('reader');
  const [editClearance, setEditClearance] = useState('1');
  
  // Состояние для отображения уведомлений
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [hasErrors, setHasErrors] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Загрузка данных с задержкой для улучшения пользовательского опыта
  useEffect(() => {
    // Проверка прав доступа
    if (!user || (user.role !== 'admin' && user.role !== 'moderator')) {
      navigate('/');
      return;
    }

    setLoading(true);
    
    // Имитация задержки сети для плавной загрузки
    const loadData = async () => {
      try {
        // Загружаем данные
        const allUsers = storage.getUsers();
        const activeUsers = allUsers.filter(u => u.status === 'active');
        const waitingUsers = allUsers.filter(u => u.status === 'pending');
        const allPositions = storage.getPositions();
        const allObjects = storage.getSCEObjects();
        const allPosts = storage.getPosts();
        
        // Устанавливаем данные в состояние с небольшой задержкой для плавности UI
        setTimeout(() => {
          setUsers(activeUsers);
          setPendingUsers(waitingUsers);
          setPositions(allPositions);
          setObjects(allObjects);
          setPosts(allPosts);
          setLoading(false);
          setLastUpdated(new Date());
          setHasErrors(false);
        }, 300);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        setHasErrors(true);
        setErrorMessage('Не удалось загрузить данные. Пожалуйста, попробуйте обновить страницу.');
        setLoading(false);
      }
    };

    loadData();
  }, [user, navigate]);

  // Функция для ручного обновления данных
  const refreshData = () => {
    setLoading(true);
    setTimeout(() => {
      const allUsers = storage.getUsers();
      setUsers(allUsers.filter(u => u.status === 'active'));
      setPendingUsers(allUsers.filter(u => u.status === 'pending'));
      setPositions(storage.getPositions());
      setObjects(storage.getSCEObjects());
      setPosts(storage.getPosts());
      setLoading(false);
      setLastUpdated(new Date());
    }, 300);
  };

  // Управление должностями
  const handleCreatePosition = () => {
    if (!newPositionName) return;

    try {
      const newPosition = storage.createPosition({
        name: newPositionName,
        description: newPositionDescription,
        clearanceLevel: parseInt(newPositionClearance),
        permissions: [],
      });

      setPositions([...positions, newPosition]);
      setNewPositionName('');
      setNewPositionDescription('');
      setNewPositionClearance('1');
    } catch (error) {
      setHasErrors(true);
      setErrorMessage('Не удалось создать должность. Пожалуйста, попробуйте еще раз.');
    }
  };

  const handleDeletePosition = (id: string) => {
    try {
      storage.deletePosition(id);
      setPositions(positions.filter(p => p.id !== id));
    } catch (error) {
      setHasErrors(true);
      setErrorMessage('Не удалось удалить должность. Пожалуйста, попробуйте еще раз.');
    }
  };

  // Управление пользователями
  const handleUpdateUser = () => {
    if (!selectedUser) return;

    try {
      const updatedUser = {
        ...selectedUser,
        role: editRole,
        clearanceLevel: parseInt(editClearance),
      };

      storage.updateUser(updatedUser);
      setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
      setSelectedUser(null);
    } catch (error) {
      setHasErrors(true);
      setErrorMessage('Не удалось обновить пользователя. Пожалуйста, попробуйте еще раз.');
    }
  };

  const handleApproveUser = (userId: string) => {
    try {
      const userToApprove = pendingUsers.find(u => u.id === userId);
      if (!userToApprove) return;

      const updatedUser = {
        ...userToApprove,
        status: 'active' as UserStatus,
      };

      storage.updateUser(updatedUser);
      setPendingUsers(pendingUsers.filter(u => u.id !== userId));
      setUsers([...users, updatedUser]);
    } catch (error) {
      setHasErrors(true);
      setErrorMessage('Не удалось одобрить пользователя. Пожалуйста, попробуйте еще раз.');
    }
  };

  const handleRejectUser = (userId: string) => {
    try {
      storage.deleteUser(userId);
      setPendingUsers(pendingUsers.filter(u => u.id !== userId));
    } catch (error) {
      setHasErrors(true);
      setErrorMessage('Не удалось отклонить пользователя. Пожалуйста, попробуйте еще раз.');
    }
  };

  // Вспомогательные функции для форматирования
  const userRoleText = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'Администратор';
      case 'moderator': return 'Модератор';
      case 'researcher': return 'Исследователь';
      case 'reader': return 'Читатель';
    }
  };

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

  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleString('ru-RU', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return 'Недопустимая дата';
    }
  };

  // Обработчик смены вкладок с механизмом оптимизации производительности
  const handleTabChange = (value: string) => {
    setCurrentTab(value);
    
    // Если переходим на вкладку с объектами, предзагружаем объекты, если их еще нет
    if (value === "objects" && objects.length === 0) {
      setLoading(true);
      setTimeout(() => {
        setObjects(storage.getSCEObjects());
        setLoading(false);
      }, 300);
    }
    
    // Аналогично для публикаций
    if (value === "publications" && posts.length === 0) {
      setLoading(true);
      setTimeout(() => {
        setPosts(storage.getPosts());
        setLoading(false);
      }, 300);
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Settings className="h-6 w-6 text-accent" />
            <h1 className="text-2xl font-bold text-black dark:text-white">Панель администратора</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden md:inline">
              Последнее обновление: {formatDate(lastUpdated.toISOString())}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshData} 
              disabled={loading}
              className="text-black dark:text-white"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="ml-2 hidden md:inline">Обновить</span>
            </Button>
          </div>
        </div>

        {hasErrors && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Ошибка</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="dashboard" onValueChange={handleTabChange}>
          <TabsList className="mb-6">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              <span className="text-black dark:text-white">Обзор</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="text-black dark:text-white">Пользователи</span>
            </TabsTrigger>
            <TabsTrigger value="approvals" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span className="text-black dark:text-white">Заявки</span>
              {pendingUsers.length > 0 && (
                <Badge variant="outline" className="ml-1 bg-orange-500 text-white">
                  {pendingUsers.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="objects" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              <span className="text-black dark:text-white">Объекты SCE</span>
            </TabsTrigger>
            <TabsTrigger value="publications" className="flex items-center gap-2">
              <Newspaper className="h-4 w-4" />
              <span className="text-black dark:text-white">Публикации</span>
            </TabsTrigger>
            <TabsTrigger value="positions" className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4" />
              <span className="text-black dark:text-white">Должности</span>
            </TabsTrigger>
          </TabsList>

          {/* Вкладка "Обзор" */}
          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-black dark:text-white">
                    <Users className="h-5 w-5 text-accent" />
                    <span>Пользователи</span>
                  </CardTitle>
                  <CardDescription>Управление пользователями</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-16 w-full" />
                  ) : (
                    <>
                      <div className="text-3xl font-bold text-black dark:text-white">{users.length}</div>
                      <p className="text-sm text-muted-foreground">Активных пользователей</p>
                      {pendingUsers.length > 0 && (
                        <div className="mt-2 flex items-center text-orange-500">
                          <span className="font-medium">{pendingUsers.length} заявок</span> 
                          <span className="ml-2 text-sm">на регистрацию</span>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" asChild className="w-full text-black dark:text-white">
                    <Link to="#" onClick={() => handleTabChange("users")}>
                      Управление пользователями
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-black dark:text-white">
                    <Database className="h-5 w-5 text-accent" />
                    <span>Объекты SCE</span>
                  </CardTitle>
                  <CardDescription>Каталог аномалий</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-16 w-full" />
                  ) : (
                    <>
                      <div className="text-3xl font-bold text-black dark:text-white">{objects.length}</div>
                      <p className="text-sm text-muted-foreground">Зарегистрированных объектов</p>
                    </>
                  )}
                </CardContent>
                <CardFooter>
                  <div className="flex gap-2 w-full">
                    <Button variant="outline" asChild className="flex-1 text-black dark:text-white">
                      <Link to="/create-object">
                        <Plus className="h-4 w-4 mr-2" />
                        Добавить
                      </Link>
                    </Button>
                    <Button variant="outline" asChild className="flex-1 text-black dark:text-white">
                      <Link to="#" onClick={() => handleTabChange("objects")}>
                        <Eye className="h-4 w-4 mr-2" />
                        Управление
                      </Link>
                    </Button>
                  </div>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-black dark:text-white">
                    <FileText className="h-5 w-5 text-accent" />
                    <span>Публикации</span>
                  </CardTitle>
                  <CardDescription>Отчеты и новости</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-16 w-full" />
                  ) : (
                    <>
                      <div className="text-3xl font-bold text-black dark:text-white">{posts.length}</div>
                      <p className="text-sm text-muted-foreground">Опубликованных материалов</p>
                    </>
                  )}
                </CardContent>
                <CardFooter>
                  <div className="flex gap-2 w-full">
                    <Button variant="outline" asChild className="flex-1 text-black dark:text-white">
                      <Link to="/create-post">
                        <FilePlus className="h-4 w-4 mr-2" />
                        Создать
                      </Link>
                    </Button>
                    <Button variant="outline" asChild className="flex-1 text-black dark:text-white">
                      <Link to="#" onClick={() => handleTabChange("publications")}>
                        <Eye className="h-4 w-4 mr-2" />
                        Управление
                      </Link>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-black dark:text-white">Быстрые действия</CardTitle>
                <CardDescription>Основные операции в системе</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center justify-center text-black dark:text-white">
                    <Link to="#" onClick={() => handleTabChange("approvals")}>
                      <UserPlus className="h-8 w-8 mb-2" />
                      <span>Проверка заявок</span>
                      {pendingUsers.length > 0 && (
                        <span className="mt-1 text-sm text-orange-500">{pendingUsers.length} ожидают</span>
                      )}
                    </Link>
                  </Button>
                  
                  <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center justify-center text-black dark:text-white">
                    <Link to="/create-object">
                      <Database className="h-8 w-8 mb-2" />
                      <span>Новый объект SCE</span>
                    </Link>
                  </Button>
                  
                  <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center justify-center text-black dark:text-white">
                    <Link to="/create-post">
                      <Newspaper className="h-8 w-8 mb-2" />
                      <span>Создать публикацию</span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Вкладка "Пользователи" */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="text-black dark:text-white">Управление пользователями</CardTitle>
                <CardDescription>Просмотр и редактирование пользователей системы</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : users.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-black dark:text-gray-400">ID</TableHead>
                        <TableHead className="text-black dark:text-gray-400">Имя</TableHead>
                        <TableHead className="text-black dark:text-gray-400">Email</TableHead>
                        <TableHead className="text-black dark:text-gray-400">Роль</TableHead>
                        <TableHead className="text-black dark:text-gray-400">Уровень доступа</TableHead>
                        <TableHead className="text-black dark:text-gray-400">Дата регистрации</TableHead>
                        <TableHead className="text-black dark:text-gray-400">Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-mono text-xs text-black dark:text-white">{user.id.substring(0, 8)}...</TableCell>
                          <TableCell className="text-black dark:text-white">{user.username}</TableCell>
                          <TableCell className="text-black dark:text-white">{user.email}</TableCell>
                          <TableCell className="text-black dark:text-white">{userRoleText(user.role)}</TableCell>
                          <TableCell className="text-black dark:text-white">{user.clearanceLevel}</TableCell>
                          <TableCell className="text-black dark:text-white">{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="mr-2 text-black dark:text-white"
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setEditRole(user.role);
                                    setEditClearance(user.clearanceLevel.toString());
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle className="text-black dark:text-white">Редактировать пользователя</DialogTitle>
                                  <DialogDescription>
                                    Измените роль и уровень доступа для пользователя {selectedUser?.username}
                                  </DialogDescription>
                                </DialogHeader>

                                <div className="grid gap-4 py-4">
                                  <div className="grid gap-2">
                                    <Label htmlFor="role" className="text-black dark:text-white">Роль</Label>
                                    <Select 
                                      value={editRole} 
                                      onValueChange={(value) => setEditRole(value as UserRole)}
                                    >
                                      <SelectTrigger className="text-black dark:text-white">
                                        <SelectValue placeholder="Выберите роль" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="admin">Администратор</SelectItem>
                                        <SelectItem value="moderator">Модератор</SelectItem>
                                        <SelectItem value="researcher">Исследователь</SelectItem>
                                        <SelectItem value="reader">Читатель</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  
                                  <div className="grid gap-2">
                                    <Label htmlFor="clearance" className="text-black dark:text-white">Уровень доступа</Label>
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
                                </div>

                                <DialogFooter>
                                  <Button onClick={handleUpdateUser} className="text-white">Сохранить изменения</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Пользователи не найдены.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Вкладка "Заявки" */}
          <TabsContent value="approvals">
            <Card>
              <CardHeader>
                <CardTitle className="text-black dark:text-white">Заявки на регистрацию</CardTitle>
                <CardDescription>Одобрение и отклонение новых пользователей</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : pendingUsers.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-black dark:text-gray-400">Имя</TableHead>
                        <TableHead className="text-black dark:text-gray-400">Email</TableHead>
                        <TableHead className="text-black dark:text-gray-400">Дата заявки</TableHead>
                        <TableHead className="text-black dark:text-gray-400">Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingUsers.map((pendingUser) => (
                        <TableRow key={pendingUser.id}>
                          <TableCell className="text-black dark:text-white">{pendingUser.username}</TableCell>
                          <TableCell className="text-black dark:text-white">{pendingUser.email}</TableCell>
                          <TableCell className="text-black dark:text-white">
                            {new Date(pendingUser.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-green-500 hover:text-green-700 border-green-500"
                                onClick={() => handleApproveUser(pendingUser.id)}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Одобрить
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-red-500 hover:text-red-700 border-red-500"
                                onClick={() => handleRejectUser(pendingUser.id)}
                              >
                                <Trash className="h-4 w-4 mr-1" />
                                Отклонить
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Заявок на регистрацию нет.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Вкладка "Объекты SCE" */}
          <TabsContent value="objects">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-black dark:text-white">Управление объектами SCE</CardTitle>
                  <CardDescription>Просмотр и редактирование каталога аномальных объектов</CardDescription>
                </div>
                <Button asChild className="text-white">
                  <Link to="/create-object">
                    <Plus className="h-4 w-4 mr-2" />
                    Создать объект
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                ) : (
                  <Suspense fallback={<LazyLoadingPlaceholder />}>
                    <ObjectManager objects={objects} />
                  </Suspense>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Вкладка "Публикации" */}
          <TabsContent value="publications">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-black dark:text-white">Создать публикацию</CardTitle>
                  <CardDescription>Опубликовать отчет, новость или объявление</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-48 w-full" />
                    </div>
                  ) : (
                    <Suspense fallback={<LazyLoadingPlaceholder />}>
                      <CreatePostForm />
                    </Suspense>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" asChild className="w-full text-black dark:text-white">
                    <Link to="/create-post">
                      <FileEdit className="h-4 w-4 mr-2" />
                      Открыть редактор публикаций
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-black dark:text-white">Последние публикации</CardTitle>
                  <CardDescription>Управление существующими публикациями</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                    </div>
                  ) : (
                    <Suspense fallback={<LazyLoadingPlaceholder />}>
                      <PostsList posts={posts.slice(0, 5)} refresh={refreshData} />
                    </Suspense>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" asChild className="w-full text-black dark:text-white">
                    <Link to="/news">
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Перейти ко всем публикациям
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          {/* Вкладка "Должности" */}
          <TabsContent value="positions">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-black dark:text-white">Управление должностями</CardTitle>
                  <CardDescription>Создание и редактирование должностей</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="position-name" className="text-black dark:text-white">Название должности</Label>
                      <Input
                        id="position-name"
                        value={newPositionName}
                        onChange={(e) => setNewPositionName(e.target.value)}
                        placeholder="Например: Старший исследователь"
                        className="text-black dark:text-white"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="position-description" className="text-black dark:text-white">Описание</Label>
                      <Input
                        id="position-description"
                        value={newPositionDescription}
                        onChange={(e) => setNewPositionDescription(e.target.value)}
                        placeholder="Описание должности и обязанностей"
                        className="text-black dark:text-white"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="position-clearance" className="text-black dark:text-white">Уровень доступа</Label>
                      <Select 
                        value={newPositionClearance} 
                        onValueChange={setNewPositionClearance}
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
                    
                    <Button className="w-full text-white" onClick={handleCreatePosition}>
                      <Plus className="h-4 w-4 mr-2" />
                      <span>Создать должность</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-black dark:text-white">Список должностей</CardTitle>
                  <CardDescription>Существующие должности и уровни доступа</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ) : positions.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-black dark:text-gray-400">Название</TableHead>
                          <TableHead className="text-black dark:text-gray-400">Уровень доступа</TableHead>
                          <TableHead className="text-black dark:text-gray-400">Действия</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {positions.map((position) => (
                          <TableRow key={position.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium text-black dark:text-white">{position.name}</div>
                                <div className="text-xs text-muted-foreground">{position.description}</div>
                              </div>
                            </TableCell>
                            <TableCell className="text-black dark:text-white">{position.clearanceLevel}</TableCell>
                            <TableCell>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleDeletePosition(position.id)}
                                className="text-red-500 border-red-500"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Должности не найдены. Создайте новую должность.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminPage;