import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { storage } from '@/utils/storage';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
  hasPermission: (clearanceLevel: number) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Загрузка пользователя из localStorage при инициализации
    const loadUser = () => {
      const savedUser = localStorage.getItem('sce_current_user');
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          setUser(userData);
        } catch (error) {
          console.error('Ошибка при парсинге пользователя:', error);
          localStorage.removeItem('sce_current_user');
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // В реальном приложении здесь должна быть проверка пароля на сервере
      // Для демонстрации просто проверяем, существует ли пользователь
      const user = storage.getUserByEmail(email);
      
      if (!user) {
        toast({
          title: "Ошибка входа",
          description: "Пользователь не найден или неверный пароль",
          variant: "destructive",
        });
        return false;
      }

      setUser(user);
      localStorage.setItem('sce_current_user', JSON.stringify(user));
      
      toast({
        title: "Успешный вход",
        description: `Добро пожаловать, ${user.username}!`,
      });
      
      return true;
    } catch (error) {
      console.error('Ошибка при входе:', error);
      toast({
        title: "Ошибка входа",
        description: "Произошла ошибка при входе в систему",
        variant: "destructive",
      });
      return false;
    }
  };

  const register = async (email: string, username: string, password: string): Promise<boolean> => {
    try {
      // Проверка, существует ли пользователь с таким email
      const existingUser = storage.getUserByEmail(email);
      
      if (existingUser) {
        toast({
          title: "Ошибка регистрации",
          description: "Пользователь с таким email уже существует",
          variant: "destructive",
        });
        return false;
      }

      // Создаем нового пользователя
      const newUser = storage.createUser({
        email,
        username,
        role: 'reader', // По умолчанию - роль читателя
        clearanceLevel: 1, // По умолчанию - базовый уровень доступа
      });

      setUser(newUser);
      localStorage.setItem('sce_current_user', JSON.stringify(newUser));
      
      toast({
        title: "Успешная регистрация",
        description: `Добро пожаловать в систему, ${username}!`,
      });
      
      return true;
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
      toast({
        title: "Ошибка регистрации",
        description: "Произошла ошибка при создании аккаунта",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sce_current_user');
    toast({
      title: "Выход из системы",
      description: "Вы успешно вышли из системы",
    });
  };

  const isAdmin = user?.role === 'admin';

  const hasPermission = (clearanceLevel: number): boolean => {
    if (!user) return false;
    return user.clearanceLevel >= clearanceLevel;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      register, 
      logout, 
      isAdmin, 
      hasPermission 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
