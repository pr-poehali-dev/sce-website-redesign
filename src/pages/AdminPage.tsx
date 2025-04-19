import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Users, FileText, Database, Settings, Plus, Edit, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
  const [positions, setPositions] = useState<Position[]>([]);
  const [newPositionName, setNewPositionName] = useState('');
  const [newPositionDescription, setNewPositionDescription] = useState('');
  const [newPositionClearance, setNewPositionClearance] = useState('1');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editRole, setEditRole] = useState<UserRole>('reader');
  const [editClearance, setEditClearance] = useState('1');

  useEffect(() => {
    // Проверка прав доступа
    if (!user || !isAdmin) {
      navigate('/');
      return;
    }

    // Загрузка данных
    const allUsers = storage.getUsers();
    setUsers(allUsers);

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

  const userRoleText = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'Администратор';
      case 'moderator': return 'Модератор';
      case 'researcher': return 'Исследователь';
      case 'reader': return 'Читатель';
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="h-6 w-6 text-accent" />
          <h1 className="text-2xl font-bold">Панель администратора</h1>
        </div>

        <Tabs defaultValue="users">
          <TabsList className="mb-6">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              <span>Обзор</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Пользователи</span>
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
                  <p className="text-sm text-muted-foreground">Зарегистрированных пользователей</p>
                </CardContent>
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
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Недавняя активность</CardTitle>
                <CardDescription>Последние действия в системе</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <p>Здесь будет отображаться журнал последних действий.</p>
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
