import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldAlert, Users, FileText, Database, Settings, Plus, Edit, Trash, 
  BarChart, CheckCircle, UserPlus, Newspaper, FilePlus 
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
import { User, Position, UserRole } from '@/types';

const AdminPage: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [newPositionName, setNewPositionName] = useState('');
  const [newPositionDescription, setNewPositionDescription] = useState('');
  const [newPositionClearance, setNewPositionClearance] = useState('1');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editRole, setEditRole] = useState<UserRole>('reader');
  const [editClearance, setEditClearance] = useState('1');
  
  // Состояние для создания публикаций
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('news');

  useEffect(() => {
    // Проверка прав доступа
    if (!user || !isAdmin) {
      navigate('/');
      return;
    }

    // Загрузка данных
    const allUsers = storage.getUsers();
    setUsers(allUsers.filter(u => u.status === 'active'));
    setPendingUsers(allUsers.filter(u => u.status === 'pending'));

    const allPositions = storage.getPositions();
    setPositions(allPositions);
  }, [user, isAdmin, navigate]);

  const handleCreatePosition = () => {
    if (!newPositionName) return;

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
  };

  const handleDeletePosition = (id: string) => {
    storage.deletePosition(id);
    setPositions(positions.filter(p => p.id !== id));
  };

  const handleUpdateUser = () => {
    if (!selectedUser) return;

    const updatedUser = {
      ...selectedUser,
      role: editRole,
      clearanceLevel: parseInt(editClearance),
    };

    storage.updateUser(updatedUser);
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    setSelectedUser(null);
  };

  const handleApproveUser = (userId: string) => {
    const userToApprove = pendingUsers.find(u => u.id === userId);
    if (!userToApprove) return;

    const updatedUser = {
      ...userToApprove,
      status: 'active' as const
    };

    storage.updateUser(updatedUser);
    setPendingUsers(pendingUsers.filter(u => u.id !== userId));
    setUsers([...users, updatedUser]);
  };

  const handleRejectUser = (userId: string) => {
    storage.deleteUser(userId);
    setPendingUsers(pendingUsers.filter(u => u.id !== userId));
  };

  const handleCreatePost = () => {
    if (!newPostTitle || !newPostContent) return;

    storage.createPost({
      title: newPostTitle,
      content: newPostContent,
      category: newPostCategory,
      authorId: user?.id || '',
      authorName: user?.username || 'Администратор',
      requiredClearance: 1,
    });

    // Сбросим форму после создания
    setNewPostTitle('');
    setNewPostContent('');
    setNewPostCategory('news');
  };

  const userRoleText = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'Администратор';
      case 'moderator': return 'Модератор';
      case 'researcher': return 'Исследователь';
      case 'reader': return 'Читатель';
    }
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

  return (
    <Layout>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="h-6 w-6 text-accent" />
          <h1 className="text-2xl font-bold">Панель администратора</h1>
        </div>

        <Tabs defaultValue="dashboard">
          <TabsList className="mb-6">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              <span>Обзор</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Пользователи</span>
            </TabsTrigger>
            <TabsTrigger value="approvals" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span>Заявки</span>
            </TabsTrigger>
            <TabsTrigger value="publications" className="flex items-center gap-2">
              <Newspaper className="h-4 w-4" />
              <span>Публикации</span>
            </TabsTrigger>
            <TabsTrigger value="positions" className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4" />
              <span>Должности</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-accent" />
                    <span>Пользователи</span>
                  </CardTitle>
                  <CardDescription>Управление пользователями</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{users.length}</div>
                  <p className="text-sm text-muted-foreground">Активных пользователей</p>
                  {pendingUsers.length > 0 && (
                    <div className="mt-2 flex items-center text-orange-500">
                      <span className="font-medium">{pendingUsers.length} заявок</span> 
                      <span className="ml-2 text-sm">на регистрацию</span>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" asChild className="w-full">
                    <Link to="#" onClick={() => document.querySelector('[data-value="users"]')?.click()}>
                      Управление пользователями
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-accent" />
                    <span>Объекты SCE</span>
                  </CardTitle>
                  <CardDescription>Каталог аномалий</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{storage.getSCEObjects().length}</div>
                  <p className="text-sm text-muted-foreground">Зарегистрированных объектов</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" asChild className="w-full">
                    <Link to="/create-object">
                      <Plus className="h-4 w-4 mr-2" />
                      Добавить объект
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-accent" />
                    <span>Публикации</span>
                  </CardTitle>
                  <CardDescription>Отчеты и новости</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{storage.getPosts().length}</div>
                  <p className="text-sm text-muted-foreground">Опубликованных материалов</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" asChild className="w-full">
                    <Link to="#" onClick={() => document.querySelector('[data-value="publications"]')?.click()}>
                      <FilePlus className="h-4 w-4 mr-2" />
                      Создать публикацию
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Быстрые действия</CardTitle>
                <CardDescription>Основные операции в системе</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                    <Link to="#" onClick={() => document.querySelector('[data-value="approvals"]')?.click()}>
                      <UserPlus className="h-8 w-8 mb-2" />
                      <span>Проверка заявок</span>
                      {pendingUsers.length > 0 && (
                        <span className="mt-1 text-sm text-orange-500">{pendingUsers.length} ожидают</span>
                      )}
                    </Link>
                  </Button>
                  
                  <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                    <Link to="/create-object">
                      <Database className="h-8 w-8 mb-2" />
                      <span>Новый объект SCE</span>
                    </Link>
                  </Button>
                  
                  <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                    <Link to="#" onClick={() => document.querySelector('[data-value="publications"]')?.click()}>
                      <Newspaper className="h-8 w-8 mb-2" />
                      <span>Создать публикацию</span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Управление пользователями</CardTitle>
                <CardDescription>Просмотр и редактирование пользователей системы</CardDescription>
              </CardHeader>
              <CardContent>
                {users.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Имя</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Роль</TableHead>
                        <TableHead>Уровень доступа</TableHead>
                        <TableHead>Дата регистрации</TableHead>
                        <TableHead>Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-mono text-xs">{user.id.substring(0, 8)}...</TableCell>
                          <TableCell>{user.username}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{userRoleText(user.role)}</TableCell>
                          <TableCell>{user.clearanceLevel}</TableCell>
                          <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="mr-2"
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
                                  <DialogTitle>Редактировать пользователя</DialogTitle>
                                  <DialogDescription>
                                    Измените роль и уровень доступа для пользователя {selectedUser?.username}
                                  </DialogDescription>
                                </DialogHeader>

                                <div className="grid gap-4 py-4">
                                  <div className="grid gap-2">
                                    <Label htmlFor="role">Роль</Label>
                                    <Select 
                                      value={editRole} 
                                      onValueChange={(value) => setEditRole(value as UserRole)}
                                    >
                                      <SelectTrigger>
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
                                    <Label htmlFor="clearance">Уровень доступа</Label>
                                    <Select 
                                      value={editClearance} 
                                      onValueChange={setEditClearance}
                                    >
                                      <SelectTrigger>
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
                                  <Button onClick={handleUpdateUser}>Сохранить изменения</Button>
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

          <TabsContent value="approvals">
            <Card>
              <CardHeader>
                <CardTitle>Заявки на регистрацию</CardTitle>
                <CardDescription>Одобрение и отклонение новых пользователей</CardDescription>
              </CardHeader>
              <CardContent>
                {pendingUsers.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Имя</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Дата заявки</TableHead>
                        <TableHead>Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingUsers.map((pendingUser) => (
                        <TableRow key={pendingUser.id}>
                          <TableCell>{pendingUser.username}</TableCell>
                          <TableCell>{pendingUser.email}</TableCell>
                          <TableCell>{new Date(pendingUser.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-green-500 hover:text-green-700"
                                onClick={() => handleApproveUser(pendingUser.id)}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Одобрить
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-red-500 hover:text-red-700"
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

          <TabsContent value="publications">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Создать публикацию</CardTitle>
                  <CardDescription>Опубликовать отчет, новость или объявление</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="post-title">Заголовок</Label>
                      <Input
                        id="post-title"
                        value={newPostTitle}
                        onChange={(e) => setNewPostTitle(e.target.value)}
                        placeholder="Введите заголовок публикации"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="post-category">Тип публикации</Label>
                      <Select 
                        value={newPostCategory} 
                        onValueChange={setNewPostCategory}
                      >
                        <SelectTrigger>
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
                      <Label htmlFor="post-content">Содержание</Label>
                      <Textarea
                        id="post-content"
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        placeholder="Введите текст публикации"
                        rows={6}
                      />
                    </div>
                    
                    <Button className="w-full" onClick={handleCreatePost}>
                      <FilePlus className="h-4 w-4 mr-2" />
                      <span>Опубликовать</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Последние публикации</CardTitle>
                  <CardDescription>Управление существующими публикациями</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {storage.getPosts().length > 0 ? (
                      storage.getPosts().slice(0, 5).map(post => (
                        <div key={post.id} className="border-b border-border pb-4 last:border-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{post.title}</h3>
                              <p className="text-sm text-muted-foreground line-clamp-2">{post.content}</p>
                            </div>
                            <div className="bg-primary/20 px-2 py-1 rounded text-xs">
                              {getCategoryLabel(post.category)}
                            </div>
                          </div>
                          <div className="flex justify-between mt-2">
                            <span className="text-xs text-muted-foreground">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline" className="text-red-500">
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
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" asChild className="w-full">
                    <Link to="/reports">
                      Перейти ко всем публикациям
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="positions">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Управление должностями</CardTitle>
                  <CardDescription>Создание и редактирование должностей</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="position-name">Название должности</Label>
                      <Input
                        id="position-name"
                        value={newPositionName}
                        onChange={(e) => setNewPositionName(e.target.value)}
                        placeholder="Например: Старший исследователь"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="position-description">Описание</Label>
                      <Input
                        id="position-description"
                        value={newPositionDescription}
                        onChange={(e) => setNewPositionDescription(e.target.value)}
                        placeholder="Описание должности и обязанностей"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="position-clearance">Уровень доступа</Label>
                      <Select 
                        value={newPositionClearance} 
                        onValueChange={setNewPositionClearance}
                      >
                        <SelectTrigger>
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
                    
                    <Button className="w-full" onClick={handleCreatePosition}>
                      <Plus className="h-4 w-4 mr-2" />
                      <span>Создать должность</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Список должностей</CardTitle>
                  <CardDescription>Существующие должности и уровни доступа</CardDescription>
                </CardHeader>
                <CardContent>
                  {positions.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Название</TableHead>
                          <TableHead>Уровень доступа</TableHead>
                          <TableHead>Действия</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {positions.map((position) => (
                          <TableRow key={position.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{position.name}</div>
                                <div className="text-xs text-muted-foreground">{position.description}</div>
                              </div>
                            </TableCell>
                            <TableCell>{position.clearanceLevel}</TableCell>
                            <TableCell>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleDeletePosition(position.id)}
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