import React from 'react';
import Layout from '@/components/layout/Layout';
import { Copyright, BookOpen, FileText } from 'lucide-react';

const CopyrightPage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="flex items-center gap-3 mb-6">
          <Copyright className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Авторские права</h1>
        </div>

        <div className="prose prose-invert max-w-none">
          <p className="lead">
            Все материалы, документы и отчеты, опубликованные на данном портале, 
            являются интеллектуальной собственностью Фонда SCE.
          </p>

          <h2 className="flex items-center gap-2 mt-8 mb-4">
            <BookOpen className="h-5 w-5 text-primary" />
            <span>Использование материалов</span>
          </h2>
          <p>
            Несанкционированное копирование, распространение или публикация материалов Фонда SCE строго запрещены. 
            Все материалы предназначены исключительно для внутреннего использования авторизованными сотрудниками Фонда.
          </p>
          <p>
            Сотрудники Фонда могут использовать материалы в служебных целях в соответствии с их уровнем допуска 
            и должностными инструкциями. Любое использование материалов вне рамок служебных обязанностей 
            требует письменного разрешения Совета О5.
          </p>

          <h2 className="flex items-center gap-2 mt-8 mb-4">
            <FileText className="h-5 w-5 text-primary" />
            <span>Публикации и цитирование</span>
          </h2>
          <p>
            Публикация исследований, отчетов и других материалов Фонда SCE в научных журналах или других открытых источниках 
            строго регламентирована. Каждая публикация должна пройти процедуру проверки и редактирования 
            Департаментом информационной безопасности.
          </p>
          <p>
            При цитировании материалов Фонда в утвержденных публикациях необходимо соблюдать следующий формат:
          </p>
          <pre className="bg-muted p-4 rounded-md">
            SCE Foundation. (Год). Название документа. Внутренний код документа. SCE Archives.
          </pre>

          <h2 className="mt-8 mb-4">Нарушения авторских прав</h2>
          <p>
            Нарушение правил использования материалов Фонда SCE может привести к:
          </p>
          <ul>
            <li>Дисциплинарным взысканиям</li>
            <li>Понижению уровня допуска</li>
            <li>Увольнению из Фонда</li>
            <li>В случае серьезных нарушений — к правовым последствиям в соответствии с процедурами безопасности Фонда</li>
          </ul>

          <div className="border-t border-border mt-8 pt-6">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Фонд SCE. Все права защищены.
            </p>
            <p className="text-sm text-muted-foreground">
              Документ SCE-CPR-2023-001
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CopyrightPage;
