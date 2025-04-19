import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="sce-footer">
      <div className="sce-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 text-xl font-bold mb-4">
              <ShieldAlert className="h-5 w-5" />
              <span>SCE Foundation</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Secure. Control. Explore. Организация, занимающаяся задержанием аномалий, исследованием и контролем.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">Навигация</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm hover:underline">Главная</Link>
              </li>
              <li>
                <Link to="/objects" className="text-sm hover:underline">Объекты SCE</Link>
              </li>
              <li>
                <Link to="/reports" className="text-sm hover:underline">Отчеты</Link>
              </li>
              <li>
                <Link to="/about" className="text-sm hover:underline">О нас</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">Правовая информация</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-sm hover:underline">Политика конфиденциальности</Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm hover:underline">Условия использования</Link>
              </li>
              <li>
                <Link to="/copyright" className="text-sm hover:underline">Авторские права</Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Фонд SCE. Все права защищены.</p>
          <p className="mt-2">Данный сайт является фан-проектом. Все содержимое предназначено исключительно для развлекательных целей.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
