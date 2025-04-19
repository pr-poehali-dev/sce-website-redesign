import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Menu, X, User, LogIn, LogOut, Info, FileText, FilePlus, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Header: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);

  const navigationItems = [
    { label: 'Главная', href: '/' },
    { label: 'Объекты SCE', href: '/objects' },
    { label: 'Отчеты', href: '/reports' },
    { label: 'О нас', href: '/about' },
  ];

  return (
    <header className="sce-header sticky top-0 z-50">
      <div className="sce-container flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold">
            <ShieldAlert className="h-6 w-6" />
            <span>SCE Foundation</span>
          </Link>
        </div>

        {/* Навигация для Desktop */}
        <nav className="hidden md:flex items-center gap-6">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="text-accent-foreground hover:underline font-medium"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="rounded-full w-10 h-10 p-0">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user.username}</DropdownMenuLabel>
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  {user.role === 'admin' ? 'Администратор' : user.role === 'moderator' ? 'Модератор' : user.role === 'researcher' ? 'Исследователь' : 'Читатель'}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                    <User className="h-4 w-4" />
                    <span>Профиль</span>
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="flex items-center gap-2 cursor-pointer">
                        <Settings className="h-4 w-4" />
                        <span>Панель админа</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/create-object" className="flex items-center gap-2 cursor-pointer">
                        <FilePlus className="h-4 w-4" />
                        <span>Создать объект SCE</span>
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="flex items-center gap-2 cursor-pointer">
                  <LogOut className="h-4 w-4" />
                  <span>Выйти</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="outline">
              <Link to="/login" className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                <span>Войти</span>
              </Link>
            </Button>
          )}

          {/* Мобильная навигация */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                  <Link to="/" className="flex items-center gap-2 text-xl font-bold" onClick={() => setIsOpen(false)}>
                    <ShieldAlert className="h-5 w-5" />
                    <span>SCE Foundation</span>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <div className="flex flex-col space-y-4">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="text-foreground hover:text-accent font-medium py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                  {!user ? (
                    <Link
                      to="/login"
                      className="flex items-center gap-2 py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      <LogIn className="h-4 w-4" />
                      <span>Войти</span>
                    </Link>
                  ) : (
                    <>
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 py-2"
                        onClick={() => setIsOpen(false)}
                      >
                        <User className="h-4 w-4" />
                        <span>Профиль</span>
                      </Link>
                      {isAdmin && (
                        <>
                          <Link
                            to="/admin"
                            className="flex items-center gap-2 py-2"
                            onClick={() => setIsOpen(false)}
                          >
                            <Settings className="h-4 w-4" />
                            <span>Панель админа</span>
                          </Link>
                          <Link
                            to="/create-object"
                            className="flex items-center gap-2 py-2"
                            onClick={() => setIsOpen(false)}
                          >
                            <FilePlus className="h-4 w-4" />
                            <span>Создать объект SCE</span>
                          </Link>
                        </>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          setIsOpen(false);
                        }}
                        className="flex items-center gap-2 py-2 text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Выйти</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
