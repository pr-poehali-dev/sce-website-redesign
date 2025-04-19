import { User, SCEObject, Post, Position, UserRole } from '@/types';

// Моковое хранилище для демонстрации
// В реальном приложении нужно будет заменить на реальную базу данных и API
class LocalStorage {
  private getItem<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Ошибка получения ${key} из localStorage:`, error);
      return defaultValue;
    }
  }

  private setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Ошибка сохранения ${key} в localStorage:`, error);
    }
  }

  // Пользователи
  getUsers(): User[] {
    return this.getItem<User[]>('sce_users', []);
  }

  getUserByEmail(email: string): User | undefined {
    return this.getUsers().find(user => user.email === email);
  }

  getUserById(id: string): User | undefined {
    return this.getUsers().find(user => user.id === id);
  }

  createUser(user: Omit<User, 'id' | 'createdAt'>): User {
    const users = this.getUsers();
    
    // Проверяем, является ли это первым пользователем
    const isFirstUser = users.length === 0;
    
    // Определяем роль и уровень доступа
    let role: UserRole = 'reader';
    let clearanceLevel = 1;
    
    // Если это первый пользователь или email соответствует админскому
    if (isFirstUser || user.email === 'artemkauniti@gmail.com') {
      role = 'admin';
      clearanceLevel = 5;
    }
    
    const newUser: User = {
      id: Date.now().toString(),
      ...user,
      role,
      clearanceLevel,
      createdAt: new Date().toISOString()
    };
    
    this.setItem('sce_users', [...users, newUser]);
    return newUser;
  }

  updateUser(user: User): User {
    const users = this.getUsers();
    const updatedUsers = users.map(u => u.id === user.id ? user : u);
    this.setItem('sce_users', updatedUsers);
    return user;
  }

  // SCE Объекты
  getSCEObjects(): SCEObject[] {
    return this.getItem<SCEObject[]>('sce_objects', []);
  }

  getSCEObjectById(id: string): SCEObject | undefined {
    return this.getSCEObjects().find(obj => obj.id === id);
  }

  createSCEObject(object: Omit<SCEObject, 'id' | 'createdAt' | 'updatedAt'>): SCEObject {
    const objects = this.getSCEObjects();
    const now = new Date().toISOString();
    
    const newObject: SCEObject = {
      id: Date.now().toString(),
      ...object,
      createdAt: now,
      updatedAt: now
    };
    
    this.setItem('sce_objects', [...objects, newObject]);
    return newObject;
  }

  updateSCEObject(object: SCEObject): SCEObject {
    const objects = this.getSCEObjects();
    const updatedObject = {
      ...object,
      updatedAt: new Date().toISOString()
    };
    
    const updatedObjects = objects.map(obj => obj.id === object.id ? updatedObject : obj);
    this.setItem('sce_objects', updatedObjects);
    return updatedObject;
  }

  deleteSCEObject(id: string): void {
    const objects = this.getSCEObjects();
    this.setItem('sce_objects', objects.filter(obj => obj.id !== id));
  }

  // Посты
  getPosts(): Post[] {
    return this.getItem<Post[]>('sce_posts', []);
  }

  getPostById(id: string): Post | undefined {
    return this.getPosts().find(post => post.id === id);
  }

  createPost(post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Post {
    const posts = this.getPosts();
    const now = new Date().toISOString();
    
    const newPost: Post = {
      id: Date.now().toString(),
      ...post,
      createdAt: now,
      updatedAt: now
    };
    
    this.setItem('sce_posts', [...posts, newPost]);
    return newPost;
  }

  updatePost(post: Post): Post {
    const posts = this.getPosts();
    const updatedPost = {
      ...post,
      updatedAt: new Date().toISOString()
    };
    
    const updatedPosts = posts.map(p => p.id === post.id ? updatedPost : p);
    this.setItem('sce_posts', updatedPosts);
    return updatedPost;
  }

  deletePost(id: string): void {
    const posts = this.getPosts();
    this.setItem('sce_posts', posts.filter(post => post.id !== id));
  }

  // Должности
  getPositions(): Position[] {
    return this.getItem<Position[]>('sce_positions', []);
  }

  getPositionById(id: string): Position | undefined {
    return this.getPositions().find(position => position.id === id);
  }

  createPosition(position: Omit<Position, 'id'>): Position {
    const positions = this.getPositions();
    
    const newPosition: Position = {
      id: Date.now().toString(),
      ...position
    };
    
    this.setItem('sce_positions', [...positions, newPosition]);
    return newPosition;
  }

  updatePosition(position: Position): Position {
    const positions = this.getPositions();
    const updatedPositions = positions.map(p => p.id === position.id ? position : p);
    this.setItem('sce_positions', updatedPositions);
    return position;
  }

  deletePosition(id: string): void {
    const positions = this.getPositions();
    this.setItem('sce_positions', positions.filter(position => position.id !== id));
  }
}

export const storage = new LocalStorage();
