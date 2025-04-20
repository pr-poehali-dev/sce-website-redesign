import { User, SCEObject, Post, Position, UserRole, UserStatus } from '@/types';

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

// LocalStorage keys
const USERS_KEY = 'sce_users';
const OBJECTS_KEY = 'sce_objects';
const POSTS_KEY = 'sce_posts';
const POSITIONS_KEY = 'sce_positions';
const CURRENT_USER_KEY = 'sce_current_user';

// Initialize storage with demo data if empty
const initializeStorage = () => {
  // Initial admin user
  if (!localStorage.getItem(USERS_KEY)) {
    const initialUsers: User[] = [
      {
        id: generateId(),
        email: 'admin@sce.org',
        username: 'Администратор',
        role: 'admin',
        status: 'active',
        clearanceLevel: 5,
        createdAt: new Date().toISOString(),
      },
      {
        id: generateId(),
        email: 'researcher@sce.org',
        username: 'Исследователь',
        role: 'researcher',
        status: 'active',
        clearanceLevel: 3,
        createdAt: new Date().toISOString(),
      },
      {
        id: generateId(),
        email: 'reader@sce.org',
        username: 'Читатель',
        role: 'reader',
        status: 'active',
        clearanceLevel: 1,
        createdAt: new Date().toISOString(),
      },
      {
        id: generateId(),
        email: 'pending@sce.org',
        username: 'Ожидающий одобрения',
        role: 'reader',
        status: 'pending',
        clearanceLevel: 1,
        createdAt: new Date().toISOString(),
      }
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(initialUsers));
  }

  // Initial objects
  if (!localStorage.getItem(OBJECTS_KEY)) {
    const initialObjects: SCEObject[] = [
      {
        id: generateId(),
        code: 'SCE-173',
        name: 'Скульптура',
        objectClass: 'евклид',
        containmentProcedures: 'Объект SCE-173 должен содержаться в запертом контейнере под постоянным видеонаблюдением.',
        description: 'SCE-173 представляет собой статую из бетона и арматуры высотой 2.1 метра. Объект способен двигаться, когда не находится в прямом визуальном контакте с живым человеком.',
        createdBy: 'admin@sce.org',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        requiredClearance: 2
      },
      {
        id: generateId(),
        code: 'SCE-096',
        name: 'Стеснительное лицо',
        objectClass: 'кетер',
        containmentProcedures: 'SCE-096 должен содержаться в специальном стальном кубе размером 5х5х5 метров. Запрещено устанавливать камеры наблюдения внутри куба.',
        description: 'SCE-096 — гуманоидное существо высотой около 2.4 метра. При визуальном контакте с его лицом, даже по фотографии или видео, объект проявляет агрессию.',
        createdBy: 'admin@sce.org',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        requiredClearance: 4
      }
    ];
    localStorage.setItem(OBJECTS_KEY, JSON.stringify(initialObjects));
  }

  // Initial posts
  if (!localStorage.getItem(POSTS_KEY)) {
    const initialPosts: Post[] = [
      {
        id: generateId(),
        title: 'Новый протокол безопасности для объектов класса Кетер',
        content: 'Совет О5 утвердил обновленные протоколы безопасности для объектов класса Кетер. Все сотрудники должны пройти переаттестацию до конца месяца.',
        category: 'announcement',
        authorId: 'admin',
        authorName: 'Администрация SCE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        requiredClearance: 1
      },
      {
        id: generateId(),
        title: 'Результаты исследования SCE-173',
        content: 'Группа исследователей под руководством д-ра [ДАННЫЕ УДАЛЕНЫ] завершила серию экспериментов с SCE-173. Обнаружено, что объект реагирует на отражения в зеркалах, как на прямой визуальный контакт.',
        category: 'research',
        authorId: 'researcher',
        authorName: 'Д-р Иванов',
        createdAt: new Date(Date.now() - 86400000).toISOString(), // вчера
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
        requiredClearance: 3
      },
      {
        id: generateId(),
        title: 'Обнаружен новый аномальный объект в [ДАННЫЕ УДАЛЕНЫ]',
        content: 'Мобильная оперативная группа "Альфа-7" обнаружила новый аномальный объект во время планового обследования заброшенной лаборатории. Объект временно классифицирован как SCE-7921.',
        category: 'news',
        authorId: 'admin',
        authorName: 'Отдел коммуникаций',
        createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 дня назад
        updatedAt: new Date(Date.now() - 172800000).toISOString(),
        requiredClearance: 2
      }
    ];
    localStorage.setItem(POSTS_KEY, JSON.stringify(initialPosts));
  }

  // Initial positions
  if (!localStorage.getItem(POSITIONS_KEY)) {
    const initialPositions: Position[] = [
      {
        id: generateId(),
        name: 'Директор сайта',
        description: 'Руководитель исследовательского комплекса',
        clearanceLevel: 5,
        permissions: ['admin', 'create', 'read', 'update', 'delete']
      },
      {
        id: generateId(),
        name: 'Старший исследователь',
        description: 'Руководитель исследовательской группы',
        clearanceLevel: 4,
        permissions: ['create', 'read', 'update']
      },
      {
        id: generateId(),
        name: 'Младший исследователь',
        description: 'Научный сотрудник',
        clearanceLevel: 3,
        permissions: ['read', 'update']
      },
      {
        id: generateId(),
        name: 'Сотрудник службы безопасности',
        description: 'Обеспечение безопасности комплекса',
        clearanceLevel: 2,
        permissions: ['read']
      }
    ];
    localStorage.setItem(POSITIONS_KEY, JSON.stringify(initialPositions));
  }
};

// Initialize storage on module load
initializeStorage();

// Storage API
export const storage = {
  // User methods
  getCurrentUser: (): User | null => {
    const userJson = localStorage.getItem(CURRENT_USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  },

  setCurrentUser: (user: User | null): void => {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  },

  getUsers: (): User[] => {
    const usersJson = localStorage.getItem(USERS_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  },

  getUserByEmail: (email: string): User | undefined => {
    const users = storage.getUsers();
    return users.find(user => user.email === email);
  },

  createUser: (userData: Omit<User, 'id' | 'createdAt'>): User => {
    const users = storage.getUsers();
    const newUser: User = {
      ...userData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      status: userData.status || 'pending' // По умолчанию новый пользователь ожидает подтверждения
    };
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
    return newUser;
  },

  updateUser: (updatedUser: User): void => {
    const users = storage.getUsers();
    const updatedUsers = users.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    );
    localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
    
    // Update current user if it's the same
    const currentUser = storage.getCurrentUser();
    if (currentUser && currentUser.id === updatedUser.id) {
      storage.setCurrentUser(updatedUser);
    }
  },

  deleteUser: (userId: string): void => {
    const users = storage.getUsers();
    const filteredUsers = users.filter(user => user.id !== userId);
    localStorage.setItem(USERS_KEY, JSON.stringify(filteredUsers));
  },

  // SCE Objects methods
  getSCEObjects: (): SCEObject[] => {
    const objectsJson = localStorage.getItem(OBJECTS_KEY);
    return objectsJson ? JSON.parse(objectsJson) : [];
  },

  getSCEObjectById: (id: string): SCEObject | undefined => {
    const objects = storage.getSCEObjects();
    return objects.find(obj => obj.id === id);
  },

  createSCEObject: (objectData: Omit<SCEObject, 'id' | 'createdAt' | 'updatedAt'>): SCEObject => {
    const objects = storage.getSCEObjects();
    const now = new Date().toISOString();
    const newObject: SCEObject = {
      ...objectData,
      id: generateId(),
      createdAt: now,
      updatedAt: now
    };
    localStorage.setItem(OBJECTS_KEY, JSON.stringify([...objects, newObject]));
    return newObject;
  },

  updateSCEObject: (updatedObject: SCEObject): void => {
    const objects = storage.getSCEObjects();
    const updatedObjects = objects.map(obj => 
      obj.id === updatedObject.id ? { ...updatedObject, updatedAt: new Date().toISOString() } : obj
    );
    localStorage.setItem(OBJECTS_KEY, JSON.stringify(updatedObjects));
  },

  deleteSCEObject: (id: string): void => {
    const objects = storage.getSCEObjects();
    const filteredObjects = objects.filter(obj => obj.id !== id);
    localStorage.setItem(OBJECTS_KEY, JSON.stringify(filteredObjects));
  },

  // Posts methods
  getPosts: (): Post[] => {
    const postsJson = localStorage.getItem(POSTS_KEY);
    return postsJson ? JSON.parse(postsJson) : [];
  },

  getPostById: (id: string): Post | undefined => {
    const posts = storage.getPosts();
    return posts.find(post => post.id === id);
  },

  createPost: (postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Post => {
    const posts = storage.getPosts();
    const now = new Date().toISOString();
    const newPost: Post = {
      ...postData,
      id: generateId(),
      createdAt: now,
      updatedAt: now
    };
    localStorage.setItem(POSTS_KEY, JSON.stringify([...posts, newPost]));
    return newPost;
  },

  updatePost: (updatedPost: Post): void => {
    const posts = storage.getPosts();
    const updatedPosts = posts.map(post => 
      post.id === updatedPost.id ? { ...updatedPost, updatedAt: new Date().toISOString() } : post
    );
    localStorage.setItem(POSTS_KEY, JSON.stringify(updatedPosts));
  },

  deletePost: (id: string): void => {
    const posts = storage.getPosts();
    const filteredPosts = posts.filter(post => post.id !== id);
    localStorage.setItem(POSTS_KEY, JSON.stringify(filteredPosts));
  },

  // Positions methods
  getPositions: (): Position[] => {
    const positionsJson = localStorage.getItem(POSITIONS_KEY);
    return positionsJson ? JSON.parse(positionsJson) : [];
  },

  getPositionById: (id: string): Position | undefined => {
    const positions = storage.getPositions();
    return positions.find(pos => pos.id === id);
  },

  createPosition: (positionData: Omit<Position, 'id'>): Position => {
    const positions = storage.getPositions();
    const newPosition: Position = {
      ...positionData,
      id: generateId()
    };
    localStorage.setItem(POSITIONS_KEY, JSON.stringify([...positions, newPosition]));
    return newPosition;
  },

  updatePosition: (updatedPosition: Position): void => {
    const positions = storage.getPositions();
    const updatedPositions = positions.map(pos => 
      pos.id === updatedPosition.id ? updatedPosition : pos
    );
    localStorage.setItem(POSITIONS_KEY, JSON.stringify(updatedPositions));
  },

  deletePosition: (id: string): void => {
    const positions = storage.getPositions();
    const filteredPositions = positions.filter(pos => pos.id !== id);
    localStorage.setItem(POSITIONS_KEY, JSON.stringify(filteredPositions));
  }
};
